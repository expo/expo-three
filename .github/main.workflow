workflow "Tests" {
  on = "push"
  resolves = ["Jest"]
}

action "Dependencies" {
  uses = "actions/npm@master"
  args = "install"
}

action "Jest" {
  uses = "docker://rkusa/jest-action:latest"
  secrets = ["GITHUB_TOKEN"]
  args = ""
  needs = ["Dependencies"]
}