#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Forward declarations
static BOOL fileExists(const char *path) {
    DWORD dwAttrib = GetFileAttributesA(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    char dir[MAX_PATH];
    GetModuleFileNameA(NULL, dir, MAX_PATH);
    char *lastSlash = strrchr(dir, '\\');
    if (lastSlash) {
        *(lastSlash + 1) = '\0';
    } else {
        strcpy(dir, ".\\");
    }

    // 1. Path to index.html in the same directory as the .exe
    char indexPath[MAX_PATH];
    snprintf(indexPath, sizeof(indexPath), "%sindex.html", dir);

    // 2. Check for local Electron executable
    char localElectron[MAX_PATH];
    snprintf(localElectron, sizeof(localElectron), "%snode_modules\\electron\\dist\\electron.exe", dir);
    char electronScript[MAX_PATH];
    snprintf(electronScript, sizeof(electronScript), "%smain.electron.cjs", dir);

    if (fileExists(localElectron) && fileExists(electronScript)) {
        char electronCmd[MAX_PATH * 2];
        snprintf(electronCmd, sizeof(electronCmd), "\"%s\" \"%s\"", localElectron, electronScript);
        STARTUPINFOA si;
        PROCESS_INFORMATION pi;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        ZeroMemory(&pi, sizeof(pi));
        if (CreateProcessA(NULL, electronCmd, NULL, NULL, FALSE, 0, NULL, dir, &si, &pi)) {
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            return 0;
        }
    }

    // 3. Try to launch index.html via Google Chrome in standalone App Mode (--app=...)
    // This gives the user a genuine native desktop window without browser toolbars!
    const char *chromePaths[] = {
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        NULL
    };

    char userChrome[MAX_PATH];
    char *localApp = getenv("LOCALAPPDATA");
    if (localApp) {
        snprintf(userChrome, sizeof(userChrome), "%s\\Google\\Chrome\\Application\\chrome.exe", localApp);
    } else {
        userChrome[0] = '\0';
    }

    char selectedBrowser[MAX_PATH] = {0};
    if (userChrome[0] && fileExists(userChrome)) {
        strncpy(selectedBrowser, userChrome, MAX_PATH - 1);
    } else {
        for (int i = 0; chromePaths[i] != NULL; i++) {
            if (fileExists(chromePaths[i])) {
                strncpy(selectedBrowser, chromePaths[i], MAX_PATH - 1);
                break;
            }
        }
    }

    // Also check Microsoft Edge as modern Chromium browser if Chrome not in default paths
    if (selectedBrowser[0] == '\0') {
        const char *edgePaths[] = {
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
            "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
            NULL
        };
        for (int i = 0; edgePaths[i] != NULL; i++) {
            if (fileExists(edgePaths[i])) {
                strncpy(selectedBrowser, edgePaths[i], MAX_PATH - 1);
                break;
            }
        }
    }

    // If a modern Chromium browser (Chrome / Edge) was found, launch index.html in App Mode!
    if (selectedBrowser[0] != '\0' && fileExists(indexPath)) {
        char appModeArgs[MAX_PATH * 3];
        snprintf(appModeArgs, sizeof(appModeArgs), "\"%s\" --app=\"file:///%s\"", selectedBrowser, indexPath);
        STARTUPINFOA si;
        PROCESS_INFORMATION pi;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        ZeroMemory(&pi, sizeof(pi));
        if (CreateProcessA(NULL, appModeArgs, NULL, NULL, FALSE, 0, NULL, dir, &si, &pi)) {
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
            return 0;
        }
    }

    // 4. Default OS ShellExecute open (guaranteed fallback for any browser)
    if (fileExists(indexPath)) {
        HINSTANCE res = ShellExecuteA(NULL, "open", indexPath, NULL, dir, SW_SHOWNORMAL);
        if ((INT_PTR)res > 32) {
            return 0;
        }
    }

    // 5. Ultimate fallback: WinExec command
    char fallbackCmd[MAX_PATH * 2];
    snprintf(fallbackCmd, sizeof(fallbackCmd), "cmd.exe /c start \"\" \"%s\"", indexPath);
    WinExec(fallbackCmd, SW_HIDE);

    return 0;
}
