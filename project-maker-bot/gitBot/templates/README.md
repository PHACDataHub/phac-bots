# project-templates-v2

## Description
sample description

## Usage

### Fetch the package
`kpt pkg get REPO_URI[.git]/PKG_PATH[@VERSION] project-templates-v2`
Details: https://kpt.dev/reference/cli/pkg/get/

### View package content
`kpt pkg tree project-templates-v2`
Details: https://kpt.dev/reference/cli/pkg/tree/

### Apply the package
```
kpt live init project-templates-v2
kpt live apply project-templates-v2 --reconcile-timeout=2m --output=table
```
Details: https://kpt.dev/reference/cli/live/
