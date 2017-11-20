/**
 * @author technohippy / https://github.com/technohippy
 */

THREE.ThreeMFLoader = function( manager ) {
        this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
        this.availableExtensions = [];
    };

    THREE.ThreeMFLoader.prototype = {

        constructor: THREE.ThreeMFLoader,

        load: function( url, onLoad, onProgress, onError ) {
            let scope = this;
            let loader = new THREE.FileLoader( scope.manager );
            loader.setResponseType( 'arraybuffer' );
            loader.load( url, function( buffer ) {
                onLoad( scope.parse( buffer ) );
            }, onProgress, onError );
        },

        parse: function( data ) {
            let scope = this;

            function loadDocument( data ) {
                let zip = null;
                let file = null;

                let relsName;
                let modelPartNames = [];
                let printTicketPartNames = [];
                let texturesPartNames = [];
                let otherPartNames = [];

                let rels;
                let modelParts = {};
                let printTicketParts = {};
                let texturesParts = {};
                let otherParts = {};

                try {
                    zip = new JSZip( data );
                } catch ( e ) {
                    if ( e instanceof ReferenceError ) {
                        console.error( 'THREE.ThreeMFLoader: jszip missing and file is compressed.' );
                        return null;
                    }
                }

                for ( file in zip.files ) {
                    if ( file.match( /\.rels$/ ) ) {
                        relsName = file;
                    } else if ( file.match(/^3D\/.*\.model$/) ) {
                        modelPartNames.push( file );
                    } else if ( file.match(/^3D\/Metadata\/.*\.xml$/) ) {
                        printTicketPartNames.push( file );
                    } else if ( file.match(/^3D\/Textures\/.*/) ) {
                        texturesPartNames.push( file );
                    } else if ( file.match(/^3D\/Other\/.*/) ) {
                        otherPartNames.push( file );
                    }
                }

                let relsView = new DataView( zip.file( relsName ).asArrayBuffer() );
                let relsFileText = new TextDecoder( 'utf-8' ).decode( relsView );
                rels = parseRelsXml( relsFileText );

                for ( var i = 0; i < modelPartNames.length; i++ ) {
                    let modelPart = modelPartNames[i];
                    let view = new DataView( zip.file( modelPart ).asArrayBuffer() );

                    if ( TextDecoder === undefined ) {
                        console.error( 'THREE.ThreeMFLoader: TextDecoder not present. Please use a TextDecoder polyfill.' );
                        return null;
                    }

                    let fileText = new TextDecoder( 'utf-8' ).decode( view );
                    let xmlData = new DOMParser().parseFromString( fileText, 'application/xml' );

                    if ( xmlData.documentElement.nodeName.toLowerCase() !== 'model' ) {
                        console.error( 'THREE.ThreeMFLoader: Error loading 3MF - no 3MF document found: ', modelPart );
                    }

                    let modelNode = xmlData.querySelector( 'model' );
                    let extensions = {};

                    for ( var i = 0; i < modelNode.attributes.length; i++ ) {
                        let attr = modelNode.attributes[i];
                        if ( attr.name.match( /^xmlns:(.+)$/ ) ) {
                            extensions[attr.value] = RegExp.$1;
                        }
                    }

                    let modelData = parseModelNode( modelNode );
                    modelData['xml'] = modelNode;

                    if ( 0 < Object.keys( extensions ).length ) {
                        modelData['extensions'] = extensions;
                    }

                    modelParts[modelPart] = modelData;
                }

                for ( var i = 0; i < texturesPartNames.length; i++ ) {
                    let texturesPartName = texturesPartNames[i];
                    texturesParts[texturesPartName] = zip.file( texturesPartName ).asBinary();
                }

                return {
                    rels: rels,
                    model: modelParts,
                    printTicket: printTicketParts,
                    texture: texturesParts,
                    other: otherParts,
                };
            }

            function parseRelsXml( relsFileText ) {
                let relsXmlData = new DOMParser().parseFromString( relsFileText, 'application/xml' );
                let relsNode = relsXmlData.querySelector( 'Relationship' );
                let target = relsNode.getAttribute( 'Target' );
                let id = relsNode.getAttribute( 'Id' );
                let type = relsNode.getAttribute( 'Type' );

                return {
                    target: target,
                    id: id,
                    type: type,
                };
            }

            function parseMetadataNodes( metadataNodes ) {
                let metadataData = {};

                for ( let i = 0; i < metadataNodes.length; i++ ) {
                    let metadataNode = metadataNodes[i];
                    let name = metadataNode.getAttribute('name');
                    let validNames = [
                        'Title',
                        'Designer',
                        'Description',
                        'Copyright',
                        'LicenseTerms',
                        'Rating',
                        'CreationDate',
                        'ModificationDate',
                    ];

                    if ( 0 <= validNames.indexOf( name ) ) {
                        metadataData[name] = metadataNode.textContent;
                    }
                }

                return metadataData;
            }

            function parseBasematerialsNode( basematerialsNode ) {
            }

            function parseMeshNode( meshNode, extensions ) {
                let meshData = {};

                let vertices = [];
                let vertexNodes = meshNode.querySelectorAll( 'vertices vertex' );

                for ( var i = 0; i < vertexNodes.length; i++ ) {
                    let vertexNode = vertexNodes[i];
                    let x = vertexNode.getAttribute( 'x' );
                    let y = vertexNode.getAttribute( 'y' );
                    let z = vertexNode.getAttribute( 'z' );

                    vertices.push( parseFloat( x ), parseFloat( y ), parseFloat( z ) );
                }

                meshData['vertices'] = new Float32Array( vertices.length );

                for ( var i = 0; i < vertices.length; i++ ) {
                    meshData['vertices'][i] = vertices[i];
                }

                let triangleProperties = [];
                let triangles = [];
                let triangleNodes = meshNode.querySelectorAll( 'triangles triangle' );

                for ( var i = 0; i < triangleNodes.length; i++ ) {
                    let triangleNode = triangleNodes[i];
                    let v1 = triangleNode.getAttribute( 'v1' );
                    let v2 = triangleNode.getAttribute( 'v2' );
                    let v3 = triangleNode.getAttribute( 'v3' );
                    let p1 = triangleNode.getAttribute( 'p1' );
                    let p2 = triangleNode.getAttribute( 'p2' );
                    let p3 = triangleNode.getAttribute( 'p3' );
                    let pid = triangleNode.getAttribute( 'pid' );

                    triangles.push( parseInt( v1, 10 ), parseInt( v2, 10 ), parseInt( v3, 10 ) );

                    let triangleProperty = {};

                    if ( p1 ) {
                        triangleProperty['p1'] = parseInt( p1, 10 );
                    }

                    if ( p2 ) {
                        triangleProperty['p2'] = parseInt( p2, 10 );
                    }

                    if ( p3 ) {
                        triangleProperty['p3'] = parseInt( p3, 10 );
                    }

                    if ( pid ) {
                        triangleProperty['pid'] = pid;
                    }

                    if ( 0 < Object.keys( triangleProperty ).length ) {
                        triangleProperties.push( triangleProperty );
                    }
                }

                meshData['triangleProperties'] = triangleProperties;
                meshData['triangles'] = new Uint32Array( triangles.length );

                for ( var i = 0; i < triangles.length; i++ ) {
                    meshData['triangles'][i] = triangles[i];
                }

                return meshData;
            }

            function parseComponentsNode( componentsNode ) {

            }

            function parseObjectNode( objectNode ) {
                let objectData = {
                    type: objectNode.getAttribute( 'type' ),
                };

                let id = objectNode.getAttribute( 'id' );

                if ( id ) {
                    objectData['id'] = id;
                }

                let pid = objectNode.getAttribute( 'pid' );

                if ( pid ) {
                    objectData['pid'] = pid;
                }

                let pindex = objectNode.getAttribute( 'pindex' );

                if ( pindex ) {
                    objectData['pindex'] = pindex;
                }

                let thumbnail = objectNode.getAttribute( 'thumbnail' );

                if ( thumbnail ) {
                    objectData['thumbnail'] = thumbnail;
                }

                let partnumber = objectNode.getAttribute( 'partnumber' );

                if ( partnumber ) {
                    objectData['partnumber'] = partnumber;
                }

                let name = objectNode.getAttribute( 'name' );

                if ( name ) {
                    objectData['name'] = name;
                }

                let meshNode = objectNode.querySelector( 'mesh' );

                if ( meshNode ) {
                    objectData['mesh'] = parseMeshNode( meshNode );
                }

                let componentsNode = objectNode.querySelector( 'components' );

                if ( componentsNode ) {
                    objectData['components'] = parseComponentsNode( componentsNode );
                }

                return objectData;
            }

            function parseResourcesNode( resourcesNode ) {
                let resourcesData = {};
                let basematerialsNode = resourcesNode.querySelector( 'basematerials' );

                if ( basematerialsNode ) {
                    resourcesData['basematerial'] = parseBasematerialsNode( basematerialsNode );
                }

                resourcesData['object'] = {};
                let objectNodes = resourcesNode.querySelectorAll( 'object' );

                for ( let i = 0; i < objectNodes.length; i++ ) {
                    let objectNode = objectNodes[i];
                    let objectData = parseObjectNode( objectNode );
                    resourcesData['object'][objectData['id']] = objectData;
                }

                return resourcesData;
            }

            function parseBuildNode( buildNode ) {
                let buildData = [];
                let itemNodes = buildNode.querySelectorAll( 'item' );

                for ( let i = 0; i < itemNodes.length; i++ ) {
                    let itemNode = itemNodes[i];
                    let buildItem = {
                        objectid: itemNode.getAttribute( 'objectid' ),
                    };
                    let transform = itemNode.getAttribute( 'transform' );

                    if ( transform ) {
                        var t = [];
                        transform.split( ' ' ).forEach( function( s ) {
                            t.push( parseFloat( s ) );
                        } );
                        let mat4 = new THREE.Matrix4();
                        buildItem['transform'] = mat4.set(
                            t[0], t[3], t[6], t[ 9],
                            t[1], t[4], t[ 7], t[10],
                            t[2], t[ 5], t[ 8], t[11],
                               0.0, 0.0, 0.0, 1.0
                        );
                    }

                    buildData.push( buildItem );
                }

                return buildData;
            }

            function parseModelNode( modelNode ) {
                let modelData = {unit: modelNode.getAttribute( 'unit' ) || 'millimeter'};
                let metadataNodes = modelNode.querySelectorAll( 'metadata' );

                if ( metadataNodes ) {
                    modelData['metadata'] = parseMetadataNodes( metadataNodes );
                }

                let resourcesNode = modelNode.querySelector( 'resources' );

                if ( resourcesNode ) {
                    modelData['resources'] = parseResourcesNode( resourcesNode );
                }

                let buildNode = modelNode.querySelector( 'build' );

                if ( buildNode ) {
                    modelData['build'] = parseBuildNode( buildNode );
                }

                return modelData;
            }

            function buildMesh( meshData, data3mf ) {
                let geometry = new THREE.BufferGeometry();
                geometry.setIndex( new THREE.BufferAttribute( meshData['triangles'], 1 ) );
                geometry.addAttribute( 'position', new THREE.BufferAttribute( meshData['vertices'], 3 ) );

                if ( meshData['colors'] ) {
                    geometry.addAttribute( 'color', new THREE.BufferAttribute( meshData['colors'], 3 ) );
                }

                geometry.computeBoundingSphere();

                let materialOpts = {
                    flatShading: true,
                };

                if ( meshData['colors'] && 0 < meshData['colors'].length ) {
                    materialOpts['vertexColors'] = THREE.VertexColors;
                } else {
                    materialOpts['color'] = 0xaaaaff;
                }

                let material = new THREE.MeshPhongMaterial( materialOpts );
                return new THREE.Mesh( geometry, material );
            }

            function applyExtensions( extensions, meshData, modelXml, data3mf ) {
                if ( ! extensions ) {
                    return;
                }

                let availableExtensions = [];
                let keys = Object.keys( extensions );

                for ( var i = 0; i < keys.length; i++ ) {
                    let ns = keys[i];

                    for ( let j = 0; j < scope.availableExtensions.length; j++ ) {
                        var extension = scope.availableExtensions[j];

                        if ( extension.ns === ns ) {
                            availableExtensions.push( extension );
                        }
                    }
                }

                for ( var i = 0; i < availableExtensions.length; i++ ) {
                    var extension = availableExtensions[i];
                    extension.apply( modelXml, extensions[extension['ns']], meshData );
                }
            }

            function buildMeshes( data3mf ) {
                let modelsData = data3mf.model;
                let meshes = {};
                let modelsKeys = Object.keys( modelsData );

                for ( let i = 0; i < modelsKeys.length; i++ ) {
                    let modelsKey = modelsKeys[i];
                    let modelData = modelsData[modelsKey];
                    let modelXml = modelData['xml'];
                    let extensions = modelData['extensions'];

                    let objectIds = Object.keys( modelData['resources']['object'] );

                    for ( let j = 0; j < objectIds.length; j++ ) {
                        let objectId = objectIds[j];
                        let objectData = modelData['resources']['object'][objectId];
                        let meshData = objectData['mesh'];
                        applyExtensions( extensions, meshData, modelXml, data3mf );
                        meshes[objectId] = buildMesh( meshData, data3mf );
                    }
                }

                return meshes;
            }

            function build( meshes, refs, data3mf ) {
                let group = new THREE.Group();
                let buildData = data3mf.model[refs['target'].substring( 1 )]['build'];

                for ( let i = 0; i < buildData.length; i++ ) {
                    let buildItem = buildData[i];
                    let mesh = meshes[buildItem['objectid']];

                    if ( buildItem['transform'] ) {
                        mesh.geometry.applyMatrix( buildItem['transform'] );
                    }

                    group.add( mesh );
                }

                return group;
            }

            let data3mf = loadDocument( data );
            let meshes = buildMeshes( data3mf );

            return build( meshes, data3mf['rels'], data3mf );
        },

        addExtension: function( extension ) {
            this.availableExtensions.push( extension );
        },

    };

