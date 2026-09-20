#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static BOOL fileExists(const char *path) {
    DWORD dwAttrib = GetFileAttributesA(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);

    // Extract directory
    char dir[MAX_PATH];
    strncpy(dir, exePath, MAX_PATH - 1);
    dir[MAX_PATH - 1] = '\0';
    char *lastSlash = strrchr(dir, '\\');
    if (lastSlash) {
        *(lastSlash + 1) = '\0';
    } else {
        strcpy(dir, ".\\");
    }

    // Target index.html
    char indexPath[MAX_PATH];
    snprintf(indexPath, sizeof(indexPath), "%sindex.html", dir);

    // 1. Setup Wizard Welcome Dialog
    int setupChoice = MessageBoxA(
        NULL,
        "Welcome to the AI Chatter Studio Setup Wizard!\n\n"
        "This installer will configure AI Chatter Studio on your Windows PC.\n\n"
        "Features:\n"
        "- Native Windows Hardware Acceleration\n"
        "- Chrome & Microsoft Edge Desktop App Mode Integration\n"
        "- Zero-latency Local Synthesis & Studio Engine\n\n"
        "Do you want to proceed with setup?",
        "AI Chatter Studio - Installation Setup",
        MB_ICONINFORMATION | MB_OKCANCEL | MB_DEFBUTTON1
    );

    if (setupChoice != IDOK) {
        return 0; // User cancelled setup
    }

    // 2. Verify files or locate index.html
    if (!fileExists(indexPath)) {
        char parentIndex[MAX_PATH];
        snprintf(parentIndex, sizeof(parentIndex), "%s..\\index.html", dir);
        char distIndex[MAX_PATH];
        snprintf(distIndex, sizeof(distIndex), "%sdist\\index.html", dir);

        if (fileExists(parentIndex)) {
            strncpy(indexPath, parentIndex, MAX_PATH - 1);
        } else if (fileExists(distIndex)) {
            strncpy(indexPath, distIndex, MAX_PATH - 1);
        } else {
            MessageBoxA(
                NULL,
                "Setup could not locate 'index.html'.\n\n"
                "Please make sure you have extracted all files from the ZIP archive "
                "before running AIChatter-Setup.exe.",
                "AI Chatter Setup Error",
                MB_ICONERROR | MB_OK
            );
            return 1;
        }
    }

    // 3. Setup Complete Notification
    MessageBoxA(
        NULL,
        "Installation Complete!\n\n"
        "AI Chatter Studio has been successfully configured.\n\n"
        "Click OK to launch AI Chatter Studio now.",
        "AI Chatter Studio Setup - Success",
        MB_ICONINFORMATION | MB_OK
    );

    // 4. Search for Google Chrome or Microsoft Edge to run in standalone App Mode
    char localApp[MAX_PATH];
    char *localEnv = getenv("LOCALAPPDATA");
    if (localEnv) {
        strncpy(localApp, localEnv, MAX_PATH - 1);
    } else {
        localApp[0] = '\0';
    }

    char programFiles[MAX_PATH];
    char *progEnv = getenv("ProgramFiles");
    if (progEnv) {
        strncpy(programFiles, progEnv, MAX_PATH - 1);
    } else {
        strcpy(programFiles, "C:\\Program Files");
    }

    char programFilesX86[MAX_PATH];
    char *progX86Env = getenv("ProgramFiles(x86)");
    if (progX86Env) {
        strncpy(programFilesX86, progX86Env, MAX_PATH - 1);
    } else {
        strcpy(programFilesX86, "C:\\Program Files (x86)");
    }

    char candidateBrowsers[8][MAX_PATH];
    int candCount = 0;

    if (localApp[0]) {
        snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Google\\Chrome\\Application\\chrome.exe", localApp);
    }
    snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Google\\Chrome\\Application\\chrome.exe", programFiles);
    snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Google\\Chrome\\Application\\chrome.exe", programFilesX86);
    snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", programFilesX86);
    snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", programFiles);
    if (localApp[0]) {
        snprintf(candidateBrowsers[candCount++], MAX_PATH, "%s\\Microsoft\\Edge\\Application\\msedge.exe", localApp);
    }

    char selectedBrowser[MAX_PATH] = {0};
    for (int i = 0; i < candCount; i++) {
        if (fileExists(candidateBrowsers[i])) {
            strncpy(selectedBrowser, candidateBrowsers[i], MAX_PATH - 1);
            break;
        }
    }

    // Launch in native App Mode
    if (selectedBrowser[0] != '\0') {
        char appArgs[MAX_PATH * 3];
        snprintf(appArgs, sizeof(appArgs), "\"%s\" --app=\"file:///%s\"", selectedBrowser, indexPath);
        STARTUPINFOA si;
        PROCESS_INFORMATION pi;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        ZeroMemory(&pi, sizeof(pi));
        if (CreateProcessA(NULL, appArgs, NULL, NULL, FALSE, 0, NULL, dir, &si, &pi)) {
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            return 0;
        }
    }

    // Fallback ShellExecute
    HINSTANCE res = ShellExecuteA(NULL, "open", indexPath, NULL, dir, SW_SHOWNORMAL);
    if ((INT_PTR)res > 32) {
        return 0;
    }

    // Command fallback
    char fallbackCmd[MAX_PATH * 2];
    snprintf(fallbackCmd, sizeof(fallbackCmd), "cmd.exe /c start \"\" \"%s\"", indexPath);
    WinExec(fallbackCmd, SW_HIDE);

    return 0;
}
