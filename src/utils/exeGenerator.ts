import { AI_CHATTER_EXE_BASE64, AI_CHATTER_SETUP_EXE_BASE64 } from './compiledExeBase64';

/**
 * Returns the compiled 64-bit Windows PE standalone application executable (AIChatter.exe).
 * 
 * When executed in Windows File Explorer:
 * 1. Automatically locates index.html in the unzipped folder.
 * 2. Launches in borderless standalone Chromium/Edge App Mode.
 * 3. Fallback to default Windows web browser.
 */
export function generateWindowsExeBinary(_appName?: string): Uint8Array {
  const binaryString = atob(AI_CHATTER_EXE_BASE64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Returns the compiled 64-bit Windows PE installation setup wizard (AIChatter-Setup.exe).
 * 
 * When executed in Windows:
 * 1. Prompts the user with an authentic Windows Setup Installation Wizard dialog.
 * 2. Verifies files and environment dependencies.
 * 3. Shows installation success confirmation.
 * 4. Launches AI Chatter Studio in native Desktop mode.
 */
export function generateWindowsSetupExeBinary(_appName?: string): Uint8Array {
  const binaryString = atob(AI_CHATTER_SETUP_EXE_BASE64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generates an automated Windows batch launcher for AIChatter.
 */
export function generateWindowsLauncherBatch(appName: string = 'AIChatter'): string {
  return `@echo off
rem =========================================================================
rem AI Chatter Studio - Windows Desktop Launcher
rem =========================================================================
setlocal enabledelayedexpansion

title AI Chatter Desktop Studio
echo.
echo =========================================================================
echo   Starting AI Chatter Desktop Application...
echo =========================================================================
echo.

if exist "%~dp0AIChatter.exe" (
    echo [OK] Launching native Windows executable: AIChatter.exe
    start "" "%~dp0AIChatter.exe"
    goto :done
)

if exist "%~dp0AIChatter-Setup.exe" (
    echo [OK] Launching Windows Installation Setup: AIChatter-Setup.exe
    start "" "%~dp0AIChatter-Setup.exe"
    goto :done
)

if exist "%~dp0node_modules\\electron\\dist\\electron.exe" (
    echo [OK] Found local Electron runtime. Launching...
    start "" "%~dp0node_modules\\electron\\dist\\electron.exe" "%~dp0main.electron.cjs"
    goto :done
)

if exist "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" (
    echo [OK] Launching via Google Chrome Desktop App Mode...
    start "" "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" --app="file:///%~dp0index.html"
    goto :done
)

if exist "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" (
    echo [OK] Launching via Google Chrome Desktop App Mode...
    start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --app="file:///%~dp0index.html"
    goto :done
)

if exist "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" (
    echo [OK] Launching via Microsoft Edge Desktop App Mode...
    start "" "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --app="file:///%~dp0index.html"
    goto :done
)

echo [OK] Launching index.html in default web browser...
start "" "%~dp0index.html"

:done
endlocal
`;
}

/**
 * Generates a silent VBS launcher for Windows that executes without opening a
 * black Command Prompt window.
 */
export function generateWindowsLauncherVbs(_appName: string = 'AIChatter'): string {
  return `' Silent Windows Launcher for AI Chatter Studio
Set WshShell = CreateObject("WScript.Shell")
strCurrentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

If CreateObject("Scripting.FileSystemObject").FileExists(strCurrentDir & "\\AIChatter.exe") Then
    WshShell.Run """" & strCurrentDir & "\\AIChatter.exe""", 1, False
ElseIf CreateObject("Scripting.FileSystemObject").FileExists(strCurrentDir & "\\AIChatter-Setup.exe") Then
    WshShell.Run """" & strCurrentDir & "\\AIChatter-Setup.exe""", 1, False
Else
    WshShell.Run """" & strCurrentDir & "\\index.html""", 1, False
End If
`;
}
