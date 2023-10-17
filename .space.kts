job("Build and push Docker") {
    startOn {
        gitPush {
            branchFilter {
                +"refs/heads/master"
            }
        }
    }
    docker {
        build {
        }
        env["IMAGES"] = Params("docker")
        push("${'$'}IMAGES/${'$'}JB_SPACE_GIT_REPOSITORY_NAME") {
            tags("latest")
        }
    }
}
