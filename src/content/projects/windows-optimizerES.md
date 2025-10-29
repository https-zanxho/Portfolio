---
title: "Optimizador de Windows"
description: "Proyecto personal diseñado para mejorar el rendimiento del sistema deshabilitando procesos y servicios innecesarios en Windows 10 y Windows 11."
pubDate: 2025-09-24
heroImage: '../../assets/images/project-windows.png'
tags: ["Optimización", "Windows", "PowerShell"]
author: "Valentino"
category: 'Showcase'
lang: "es"
---

### Lo que hice
- Desarrollo de un script para optimizar el sistema deshabilitando servicios y procesos que consumen recursos innecesarios en Windows 10 y 11.

### Resultados
- Mejora del rendimiento general del sistema y reducción en el uso de memoria y procesos en segundo plano.
```python
# PatronDarwin.ps1
# Optimizador - Menu completo + Submenu de servicios (opcion 9)
# Ejecutar como Admin (auto-elevacion incluida)

# =========================
#  Auto-elevacion a Admin
# =========================
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

function Pause { Read-Host "Presiona ENTER para continuar..." | Out-Null }

# Helpers
function Set-DwordHKLM {
    param(
        [Parameter(Mandatory=$true)][string]$path,
        [Parameter(Mandatory=$true)][string]$name,
        [Parameter(Mandatory=$true)][int]$value
    )
    $fullPath = "HKLM:\$path"
    try {
        if (-not (Test-Path $fullPath)) { New-Item -Path $fullPath -Force | Out-Null }
        # Si la propiedad existe, Set-ItemProperty la actualiza; si no existe, New-ItemProperty la crea.
        if (Get-ItemProperty -Path $fullPath -Name $name -ErrorAction SilentlyContinue) {
            Set-ItemProperty -Path $fullPath -Name $name -Value $value -ErrorAction Stop
        } else {
            New-ItemProperty -Path $fullPath -Name $name -PropertyType DWord -Value $value -Force | Out-Null
        }
    } catch {
        Write-Host "Error writing HKLM:\$path\$name : $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Set-DwordHKCU {
    param(
        [Parameter(Mandatory=$true)][string]$path,
        [Parameter(Mandatory=$true)][string]$name,
        [Parameter(Mandatory=$true)][int]$value
    )
    $fullPath = "HKCU:\$path"
    try {
        if (-not (Test-Path $fullPath)) { New-Item -Path $fullPath -Force | Out-Null }
        if (Get-ItemProperty -Path $fullPath -Name $name -ErrorAction SilentlyContinue) {
            Set-ItemProperty -Path $fullPath -Name $name -Value $value -ErrorAction Stop
        } else {
            New-ItemProperty -Path $fullPath -Name $name -PropertyType DWord -Value $value -Force | Out-Null
        }
    } catch {
        Write-Host "Error writing HKCU:\$path\$name : $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Disable-ServiceByReg {
    param([Parameter(Mandatory=$true)][string]$svcName)
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Services\$svcName"
    if (Test-Path $regPath) {
        try {
            # Es preferible Set-ItemProperty para cambiar Start
            Set-ItemProperty -Path $regPath -Name "Start" -Value 4 -ErrorAction Stop
            # Intentar parar el servicio si está corriendo
            try {
                $sc = Get-Service -Name $svcName -ErrorAction Stop
                if ($sc.Status -eq 'Running') {
                    Stop-Service -Name $svcName -Force -ErrorAction SilentlyContinue
                }
            } catch {
                # servicio puede no existir o no poder pararse, no es crítico
            }
            Write-Host "  [OK] $svcName -> Disabled (Start=4)" -ForegroundColor Green
        } catch {
            Write-Host "  [ERR] $svcName -> $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  [SKIP] $svcName no existe en este sistema." -ForegroundColor DarkYellow
    }
}

# =========================
#   Submenu Opcion 9
# =========================
function Menu-Servicios {
    while ($true) {
        Clear-Host
        Write-Host "=========================================" -ForegroundColor White
        Write-Host " OPCION 9 - Desactivar servicios (menu) " -ForegroundColor White
        Write-Host "=========================================" -ForegroundColor White
        Write-Host "OPCIONAL = desactivalos solo si NO los usas." -ForegroundColor Yellow
        Write-Host ""
        Write-Host " 1)  Desactivar BLUETOOTH (BTAGService, bthserv)"
        Write-Host " 2)  Desactivar EXTRAS (WbioSrvc, FontCache, hidserv, GraphicsPerfSvc, stisvc, WerSvc, PcaSvc, Wecsvc)"
        Write-Host " 3)  Desactivar DIAGNOSTICO/TELEMETRIA (DiagTrack, dmwappushservice, diagsvc, DPS, diagnosticshub..., WdiServiceHost, WdiSystemHost)"
        Write-Host " 4)  Desactivar XBOX (XblGameSave, XboxNetApiSvc, XboxGipSvc, XblAuthManager)  [OPCIONAL]"
        Write-Host " 5)  Desactivar IMPRESION (Spooler, PrintNotify)                                [OPCIONAL]"
        Write-Host " 6)  Desactivar MAPS (MapsBroker)                                              [OPCIONAL]"
        Write-Host " 7)  APLICAR TODO (1-6)"
        Write-Host " 8)  VOLVER"
        $s = Read-Host "Elige una opcion"

        switch ($s) {
            '1' {
                Write-Host "`n==> Bluetooth" -ForegroundColor Cyan
                Disable-ServiceByReg "BTAGService"
                Disable-ServiceByReg "bthserv"
                Pause
            }
            '2' {
                Write-Host "`n==> Extras" -ForegroundColor Cyan
                @("WbioSrvc","FontCache","FontCache3.0.0.0","hidserv","GraphicsPerfSvc","stisvc","WerSvc","PcaSvc","Wecsvc") |
                    ForEach-Object { Disable-ServiceByReg $_ }
                Pause
            }
            '3' {
                Write-Host "`n==> Diagnostico y Telemetria" -ForegroundColor Cyan
                @("DiagTrack","dmwappushservice","diagsvc","DPS","diagnosticshub.standardcollector.service","WdiServiceHost","WdiSystemHost") |
                    ForEach-Object { Disable-ServiceByReg $_ }
                Pause
            }
            '4' {
                Write-Host "`n==> Xbox (opcional)" -ForegroundColor Cyan
                @("XblGameSave","XboxNetApiSvc","XboxGipSvc","XblAuthManager") | ForEach-Object { Disable-ServiceByReg $_ }
                Pause
            }
            '5' {
                Write-Host "`n==> Impresion (opcional)" -ForegroundColor Cyan
                @("Spooler","PrintNotify") | ForEach-Object { Disable-ServiceByReg $_ }
                Pause
            }
            '6' {
                Write-Host "`n==> MapsBroker (opcional)" -ForegroundColor Cyan
                Disable-ServiceByReg "MapsBroker"
                Pause
            }
            '7' {
                Write-Host "`n==> Aplicando TODO (1-6)" -ForegroundColor Cyan
                @(
                    "BTAGService","bthserv",
                    "WbioSrvc","FontCache","FontCache3.0.0.0","hidserv","GraphicsPerfSvc","stisvc","WerSvc","PcaSvc","Wecsvc",
                    "DiagTrack","dmwappushservice","diagsvc","DPS","diagnosticshub.standardcollector.service","WdiServiceHost","WdiSystemHost",
                    "XblGameSave","XboxNetApiSvc","XboxGipSvc","XblAuthManager",
                    "Spooler","PrintNotify","MapsBroker"
                ) | ForEach-Object { Disable-ServiceByReg $_ }
                Write-Host "`n✅ TODO aplicado." -ForegroundColor Green
                Pause
            }
            '8' {
                Write-Host "`nVolviendo al menú principal..." -ForegroundColor Yellow
                return
            }
            default {
                Write-Host "Opción no válida." -ForegroundColor DarkYellow
                Pause
            }
        }
    }
}

# =========================
#      MENU PRINCIPAL
# =========================
while ($true) {
    Clear-Host
    Write-Host "===============================" -ForegroundColor White
    Write-Host "       MENU PRINCIPAL" -ForegroundColor White
    Write-Host "===============================" -ForegroundColor White
    Write-Host "1)  Activar modo Maximo rendimiento"
    Write-Host "2)  Descargar MSI Afterburner"
    Write-Host "3)  Descargar Reduce Memory"
    Write-Host "4)  Ajustar apariencia a rendimiento"
    Write-Host "5)  Aplicar Tweaks de rendimiento"
    Write-Host "6)  Instalar los drivers CORRESPONDIENTES"
    Write-Host "7)  Desactivar Modo Juego"
    Write-Host "8)  Desactivar efectos de transparencia"
    Write-Host "9)  Desactivar servicios innecesarios (menu)"
    Write-Host "10) SALIR"
    $ans = Read-Host "Selecciona una opcion"

    switch ($ans) {
        '1' {
            Write-Host "`n==> Ultimate Performance" -ForegroundColor Cyan
            try {
                Start-Process -FilePath "powercfg" -ArgumentList "-duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61" -NoNewWindow -Wait -ErrorAction Stop
                Start-Process -FilePath "powercfg" -ArgumentList "-setactive e9a42b02-d5df-448d-aa00-03f14749eb61" -NoNewWindow -Wait -ErrorAction Stop
                Write-Host "`n✅ Plan 'Ultimate Performance' activado." -ForegroundColor Green
            } catch {
                Write-Host "Error activando plan de energía: $($_.Exception.Message)" -ForegroundColor Red
            }
            Pause
        }
        '2' {
            Write-Host "`n==> Descargar MSI Afterburner" -ForegroundColor Cyan
            Start-Process 'https://download.msi.com/uti_exe/vga/MSIAfterburnerSetup.zip?__token__=exp=1758881041~acl=/*~hmac=b65cae7ba745797c8ea4616809b1e3e81082c3214f0f427d4208a88ec177abcf'
            Write-Host "`n✅ Descarga iniciada (revisa el navegador/Descargas)." -ForegroundColor Green
            Pause
        }
        '3' {
            Write-Host "`n==> Descargar Reduce Memory" -ForegroundColor Cyan
            Start-Process 'https://www.sordum.org/files/downloads.php?st-reduce-memory'
            Write-Host "`n✅ Descarga iniciada (revisa el navegador/Descargas)." -ForegroundColor Green
            Pause
        }
        '4' {
            Write-Host "`n==> Apariencia: Mejor rendimiento" -ForegroundColor Cyan
            try {
                # VisualFXSetting: 0 auto, 1 apariencia, 2 rendimiento, 3 personalizado
                Set-DwordHKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" "VisualFXSetting" 2
                Write-Host "`n✅ Apariencia ajustada a rendimiento." -ForegroundColor Green
            } catch {
                Write-Host "Error ajustando apariencia: $($_.Exception.Message)" -ForegroundColor Red
            }
            Pause
        }
        '5' {
            Write-Host "`n==> Tweaks de rendimiento" -ForegroundColor Cyan
            try { Checkpoint-Computer -Description "Antes de Tweaks" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop } catch {}
            # Limpieza TEMP, %TEMP%, PREFETCH
            Write-Host "Limpiando TEMP/%TEMP%/PREFETCH..." -ForegroundColor Yellow
            $dirs = @("$env:SystemRoot\Temp", $env:TEMP, "$env:SystemRoot\Prefetch")
            foreach ($d in $dirs) {
                if (Test-Path $d) {
                    try {
                        Get-ChildItem $d -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                        Write-Host "  → Limpieza: $d" -ForegroundColor DarkGreen
                    } catch {
                        Write-Host "  ! No se pudo limpiar: $d" -ForegroundColor DarkYellow
                    }
                }
            }
            # Telemetria
            Set-DwordHKLM "SOFTWARE\Policies\Microsoft\Windows\DataCollection" "AllowTelemetry" 0
            # GameDVR
            Set-DwordHKLM "SOFTWARE\Policies\Microsoft\Windows\GameDVR" "AllowGameDVR" 0
            # Hibernacion
            try { Start-Process -FilePath "powercfg" -ArgumentList "-hibernate off" -NoNewWindow -Wait -ErrorAction Stop } catch {}
            # HomeGroup (puede no existir en versiones modernas)
            try { sc.exe config HomeGroupListener start= disabled | Out-Null } catch {}
            try { sc.exe config HomeGroupProvider start= disabled | Out-Null } catch {}
            # Location
            Set-DwordHKLM "SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors" "DisableLocation" 1
            # Wi-Fi Sense
            Set-DwordHKLM "SOFTWARE\Microsoft\PolicyManager\default\WiFi\AllowWiFiHotSpotReporting" "Value" 0
            Set-DwordHKLM "SOFTWARE\Microsoft\PolicyManager\default\WiFi\AllowAutoConnectToWiFiSenseHotspots" "Value" 0

            Write-Host "`n✅ Tweaks aplicados. Reinicia para asegurar todos los cambios." -ForegroundColor Green
            Pause
        }
        '6' {
            Write-Host "`n==> Drivers" -ForegroundColor Cyan
            Start-Process 'https://www.nvidia.com/es-es/drivers/'
            Write-Host "Abrí la pagina y descarga el controlador para tu GPU." -ForegroundColor Yellow
            Pause
        }
        '7' {
            Write-Host "`n==> Desactivar Modo Juego" -ForegroundColor Cyan
            try {
                Set-DwordHKCU "Software\Microsoft\GameBar" "AllowAutoGameMode" 0
                Set-DwordHKCU "Software\Microsoft\GameBar" "AutoGameModeEnabled" 0
                Write-Host "`n✅ Modo Juego desactivado." -ForegroundColor Green
            } catch {
                Write-Host "Error desactivando Modo Juego: $($_.Exception.Message)" -ForegroundColor Red
            }
            Pause
        }
        '8' {
            Write-Host "`n==> Desactivar Transparencia" -ForegroundColor Cyan
            try {
                Set-DwordHKCU "Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" "EnableTransparency" 0
                Write-Host "`n✅ Transparencia desactivada." -ForegroundColor Green
            } catch {
                Write-Host "Error desactivando transparencia: $($_.Exception.Message)" -ForegroundColor Red
            }
            Pause
        }
        '9' {
            Menu-Servicios
        }
        '10' {
            Write-Host "`nSaliendo..." -ForegroundColor Yellow
            Start-Sleep -Milliseconds 300
            exit 0   # <- cierra el script/EXE
        }
        default {
            Write-Host "Opción no válida." -ForegroundColor DarkYellow
            Pause
        }
    }
}

Write-Host "`nSaliendo..." -ForegroundColor White
