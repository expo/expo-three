import { Platform, Dimensions } from 'react-native';
import { Constants } from 'expo';

const debug = __DEV__;
const isRunningInExpo = Constants.appOwnership === 'expo';

const isIphone = Platform.OS === 'ios';
const isInReview = !debug && !isRunningInExpo && true; //TODO: Change this.

//https://github.com/ptelad/react-native-iphone-x-helper/blob/3c919346769e3cb9315a5254d43fcad1aadee777/index.js#L1-L11
function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    isIphone &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
}

export default {
  isIphoneX: isIphoneX(),
  isIphone,
  isInReview,
  isInAppleReview: isInReview && isIphone,
};
