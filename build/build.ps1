
# take in a string argument to know if we should publish the package or not
# so we can run the script with the argument "publish" and nothing else to publish the package
param(
    [string]$publish = ""
)

# assert that the argument is either empty or "publish"
if ($publish -ne "" -and $publish -ne "publish") {
    write-host "Invalid argument. Must be empty or 'publish'"
    exit 1
}


$scriptDirectory = $PSScriptRoot

# parent of script directory
$projectDirectory = Split-Path -Path $scriptDirectory -Parent

# first get whatever directory we ran from so we can return to it later
$originalDirectory = Get-Location
write-host "Original Directory: $originalDirectory"

# change to the project directory
Set-Location $projectDirectory


write-host "Building project in $projectDirectory"

write-host "Running npm install"
npm install

write-host "Deleting dist directory"
Remove-Item -Recurse -Force "dist"

write-host "Running ng build"
ng build -c development

$angularJsonPath = "$projectDirectory/angular.json"
$angularJson = Get-Content -Path $angularJsonPath -Raw
$angularConfig = $angularJson | ConvertFrom-Json
$projectName = "ClientApp"
$projectOutputPath = $angularConfig.projects.$projectName.architect.build.options.outputPath

# now copy the package.json file from the scriptDirectory to the output directory
write-host "Copying package.json to $projectOutputPath"
Copy-Item -Path "$scriptDirectory/package.json" -Destination "$projectOutputPath/package.json"

# make a directory for the npm package to be created in
write-host "Creating directory for npm package"
New-Item -ItemType Directory -Force -Path output


# now change to the output directory
Set-Location $projectOutputPath

write-host "Creating npm package"
npm pack --pack-destination "$projectDirectory/output"

# publish the package to the npm registry

write-host "Publishing npm package"
# only run if the argument is "publish"
if ($publish -eq "publish") {
    npm publish
}
else {
    write-host "Skipping publish"

}


Set-Location $originalDirectory
write-host "Build Complete"
