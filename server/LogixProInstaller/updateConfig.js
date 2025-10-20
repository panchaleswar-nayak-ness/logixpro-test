function replaceServerUrlInFile() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");

    // Get the installation directory and the new server URL
    var customActionData = Session.Property("CustomActionData").split(';');
    var installDir = customActionData[0];
    var serverUrl = customActionData[1];

    var targetFile = "wwwroot\\index.html";
    var filePath = fso.BuildPath(installDir, targetFile);

    if (!serverUrl || serverUrl.replace(/^\s+|\s+$/g, '') === "") {
        serverUrl = "https://localhost:5001";
    }

    var placeholderUrl = "https://localhost:5001";

    if (fso.FileExists(filePath)) {
        var file = fso.OpenTextFile(filePath, 1);
        var content = file.ReadAll();
        file.Close();

        var regex = new RegExp(placeholderUrl, "g");
        var newContent = content.replace(regex, serverUrl);

        // Write the modified content back to the file
        var outFile = fso.OpenTextFile(filePath, 2);
        outFile.Write(newContent);
        outFile.Close();
    }

    return 0;
}