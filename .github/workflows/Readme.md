# How to prepare a VM to execute PickFace Tests

The pipeline in Github Actions (GA) is performing the following steps:

- Build the latest installer
- Upload the latest artifacts on Azure Blob Storage
- Download the latest TestAutomation files on the target VM
- Run the tests
- Upload the test results
In order to be able to run the tests on the desktop app, after connecting to the VM using RDP, the user should disconnect by running the `keep_session.bat`, found in `.github\workflows\runner-scripts` folder. This ensures that the session keeps running, even when RDP has been disconnected

# Checklist
- Connect to the VM
- Open a cmd and run `appium`, keep the cmd open
- Open another cmd and navigate to `C:\actions-runner` and run `run.cmd`, keep the cmd open
- Run `keep_session.bat` (can be found on desktop) to disconnect
- Wait for tests to complete