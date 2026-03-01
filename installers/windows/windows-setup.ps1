#Requires -RunAsAdministrator
<#
.SYNOPSIS
    GridVision SCADA - Windows PowerShell Installer
.DESCRIPTION
    Automated installer for GridVision SCADA on Windows.
    Installs prerequisites (PostgreSQL 16, Redis/Memurai, Node.js, pnpm, NSSM),
    clones the repository, builds the app, runs database migrations and seed,
    creates shortcuts, sets up a Windows service via NSSM, and verifies health.
.NOTES
    Version: 1.0.0
    Publisher: GridVision Technologies
    Run: Right-click PowerShell -> Run as Administrator
         ./windows-setup.ps1
#>

param(
    [string]$InstallDir = "$env:ProgramFiles\GridVision",
    [string]$RepoUrl = "https://github.com/chatgptnotes/GridVision.git",
    [int]$Port = 5173,
    [switch]$SkipPrereqs,
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Version = "1.0.0"
$ServiceName = "GridVisionSCADA"
$NodeMinVersion = 18
$BackendPort = 3001

# --- Banner ---
Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "   GridVision SCADA Installer v$Version"   -ForegroundColor Cyan
Write-Host "   Windows PowerShell Installer"           -ForegroundColor Cyan
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""

# --- Uninstall ---
if ($Uninstall) {
    Write-Host "[INFO] Uninstalling GridVision SCADA..." -ForegroundColor Yellow

    # Stop and remove NSSM service
    if (Test-Command "nssm") {
        nssm stop $ServiceName 2>$null
        nssm remove $ServiceName confirm 2>$null
        Write-Host "[OK] NSSM service removed" -ForegroundColor Green
    }

    # Stop and remove scheduled task fallback
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($svc) {
        Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
        sc.exe delete $ServiceName | Out-Null
        Write-Host "[OK] Service removed" -ForegroundColor Green
    }

    # Remove scheduled task if it exists
    $task = Get-ScheduledTask -TaskName $ServiceName -ErrorAction SilentlyContinue
    if ($task) {
        Unregister-ScheduledTask -TaskName $ServiceName -Confirm:$false
        Write-Host "[OK] Scheduled task removed" -ForegroundColor Green
    }

    # Remove install directory
    if (Test-Path $InstallDir) {
        Remove-Item -Path $InstallDir -Recurse -Force
        Write-Host "[OK] Installation directory removed" -ForegroundColor Green
    }

    # Remove desktop shortcut
    $shortcut = "$env:USERPROFILE\Desktop\GridVision SCADA.lnk"
    if (Test-Path $shortcut) {
        Remove-Item $shortcut -Force
    }

    # Remove Start Menu
    $startMenu = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\GridVision SCADA"
    if (Test-Path $startMenu) {
        Remove-Item $startMenu -Recurse -Force
    }

    Write-Host ""
    Write-Host "[OK] GridVision SCADA has been uninstalled." -ForegroundColor Green
    exit 0
}

# --- Helper Functions ---
function Test-Command($cmd) {
    try { Get-Command $cmd -ErrorAction Stop | Out-Null; return $true }
    catch { return $false }
}

function Write-Step($message) {
    Write-Host "[INFO] $message" -ForegroundColor White
}

function Write-Success($message) {
    Write-Host "[OK] $message" -ForegroundColor Green
}

function Write-Fail($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# --- Check Administrator ---
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Fail "This installer must be run as Administrator."
    Write-Host "Right-click PowerShell and select 'Run as Administrator'." -ForegroundColor Yellow
    exit 1
}

# --- Check Prerequisites ---
if (-not $SkipPrereqs) {
    Write-Host "--- Checking Prerequisites ---" -ForegroundColor Yellow
    Write-Host ""

    # Chocolatey
    if (Test-Command "choco") {
        Write-Success "Chocolatey found"
    } else {
        Write-Step "Chocolatey not found. Installing..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        Write-Success "Chocolatey installed"
    }

    # Git
    if (Test-Command "git") {
        $gitVer = git --version
        Write-Success "Git found: $gitVer"
    } else {
        Write-Step "Git not found. Installing via winget..."
        try {
            winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "Git installed"
        } catch {
            Write-Fail "Failed to install Git. Please install manually: https://git-scm.com"
            exit 1
        }
    }

    # Node.js
    if (Test-Command "node") {
        $nodeVer = node --version
        $nodeMajor = [int]($nodeVer -replace "v(\d+)\..*", '$1')
        if ($nodeMajor -ge $NodeMinVersion) {
            Write-Success "Node.js found: $nodeVer"
        } else {
            Write-Fail "Node.js v$NodeMinVersion+ required. Found: $nodeVer"
            Write-Step "Installing Node.js v20 LTS via winget..."
            winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        }
    } else {
        Write-Step "Node.js not found. Installing v20 LTS via winget..."
        try {
            winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "Node.js installed"
        } catch {
            Write-Fail "Failed to install Node.js. Please install from https://nodejs.org"
            exit 1
        }
    }

    # pnpm
    if (Test-Command "pnpm") {
        Write-Success "pnpm found"
    } else {
        Write-Step "Installing pnpm..."
        npm install -g pnpm
        Write-Success "pnpm installed"
    }

    # PostgreSQL 16
    if (Test-Command "psql") {
        Write-Success "PostgreSQL found"
    } else {
        Write-Step "Installing PostgreSQL 16 via Chocolatey..."
        try {
            choco install postgresql16 --params '/Password:gridvision_pass' -y
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "PostgreSQL 16 installed"
        } catch {
            Write-Fail "Failed to install PostgreSQL 16. Please install manually: https://www.postgresql.org/download/windows/"
            exit 1
        }
    }

    # Redis (Memurai for Windows)
    if (Test-Command "memurai-cli") {
        Write-Success "Memurai (Redis for Windows) found"
    } else {
        Write-Step "Installing Memurai (Redis-compatible server for Windows)..."
        try {
            choco install memurai -y
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "Memurai installed"
        } catch {
            Write-Host "[WARN] Memurai installation failed. Redis may not be available." -ForegroundColor Yellow
        }
    }

    # NSSM (Non-Sucking Service Manager)
    if (Test-Command "nssm") {
        Write-Success "NSSM found"
    } else {
        Write-Step "Installing NSSM (service manager)..."
        try {
            choco install nssm -y
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "NSSM installed"
        } catch {
            Write-Host "[WARN] NSSM installation failed. Will fall back to scheduled task." -ForegroundColor Yellow
        }
    }

    Write-Host ""
}

# --- Clone or Update Repository ---
Write-Host "--- Installing GridVision SCADA ---" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "$InstallDir\.git") {
    Write-Step "Existing installation found. Updating..."
    Push-Location $InstallDir
    git pull origin main
    Pop-Location
    Write-Success "Repository updated"
} else {
    if (Test-Path $InstallDir) {
        Remove-Item $InstallDir -Recurse -Force
    }
    Write-Step "Cloning repository..."
    git clone $RepoUrl $InstallDir
    Write-Success "Repository cloned to $InstallDir"
}

# --- Install Dependencies ---
Write-Step "Installing dependencies (this may take a few minutes)..."
Push-Location $InstallDir
pnpm install
Pop-Location
Write-Success "Dependencies installed"

# --- Build Web App ---
Write-Step "Building web application..."
Push-Location "$InstallDir\apps\web"
try {
    npx vite build
    Write-Success "Web application built"
} catch {
    Write-Host "[WARN] Build failed. Dev mode will still work." -ForegroundColor Yellow
}
Pop-Location

# --- Build Server ---
Write-Step "Building server application..."
Push-Location "$InstallDir\apps\server"
try {
    npx tsc --build 2>$null
    Write-Success "Server application built"
} catch {
    Write-Host "[WARN] Server build step skipped or failed." -ForegroundColor Yellow
}
Pop-Location

# --- Create .env File ---
$envFile = "$InstallDir\.env"
if (-not (Test-Path $envFile)) {
    Write-Step "Generating .env configuration..."
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    @"
# GridVision SCADA Environment Configuration
DATABASE_URL=postgresql://gridvision:gridvision_pass@localhost:5432/gridvision_scada
REDIS_URL=redis://localhost:6379
JWT_SECRET=$jwtSecret
PORT=$BackendPort
CORS_ORIGIN=http://localhost:$Port
NODE_ENV=production
"@ | Set-Content $envFile
    Write-Success ".env file created"
}

# --- Setup Database ---
Write-Step "Setting up PostgreSQL database..."
try {
    # Refresh PATH to ensure psql is available
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    # Create user and database if they do not exist
    $dbExists = $false
    try {
        $result = psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='gridvision_scada'" 2>$null
        if ($result -match "1") { $dbExists = $true }
    } catch { }

    if (-not $dbExists) {
        Write-Step "Creating database user and database..."
        psql -U postgres -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'gridvision') THEN CREATE USER gridvision WITH PASSWORD 'gridvision_pass'; END IF; END `$`$;" 2>$null
        psql -U postgres -c "CREATE DATABASE gridvision_scada OWNER gridvision;" 2>$null
        psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE gridvision_scada TO gridvision;" 2>$null
        Write-Success "Database 'gridvision_scada' created"
    } else {
        Write-Success "Database 'gridvision_scada' already exists"
    }
} catch {
    Write-Host "[WARN] Database setup encountered issues: $_" -ForegroundColor Yellow
    Write-Host "[WARN] You may need to create the database manually." -ForegroundColor Yellow
}

# --- Run Prisma Migrations ---
Write-Step "Running Prisma database migrations..."
Push-Location "$InstallDir\apps\server"
try {
    npx prisma migrate deploy
    Write-Success "Database migrations applied"
} catch {
    Write-Host "[WARN] Prisma migrate failed: $_. You may need to run migrations manually." -ForegroundColor Yellow
}
Pop-Location

# --- Seed Default Admin User ---
Write-Step "Seeding default admin user..."
Push-Location "$InstallDir\apps\server"
try {
    npx prisma db seed
    Write-Success "Default admin user seeded (admin@gridvision.local / admin123)"
} catch {
    Write-Host "[WARN] Database seed failed: $_. You may need to seed manually." -ForegroundColor Yellow
}
Pop-Location

# --- Create Windows Service via NSSM ---
Write-Step "Setting up Windows service..."

# Refresh PATH again after all installs
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $svc) {
    if (Test-Command "nssm") {
        Write-Step "Installing GridVision as a Windows service via NSSM..."
        $nodePath = (Get-Command node).Source
        nssm install $ServiceName $nodePath "$InstallDir\apps\server\dist\index.js"
        nssm set $ServiceName AppDirectory $InstallDir
        nssm set $ServiceName Description "GridVision SCADA Server"
        nssm set $ServiceName Start SERVICE_AUTO_START
        nssm set $ServiceName AppStdout "$InstallDir\logs\gridvision-stdout.log"
        nssm set $ServiceName AppStderr "$InstallDir\logs\gridvision-stderr.log"
        nssm set $ServiceName AppRotateFiles 1
        nssm set $ServiceName AppRotateBytes 1048576

        # Create logs directory
        if (-not (Test-Path "$InstallDir\logs")) {
            New-Item -ItemType Directory -Path "$InstallDir\logs" -Force | Out-Null
        }

        # Set environment variables for the service
        nssm set $ServiceName AppEnvironmentExtra "NODE_ENV=production"

        # Start the backend service
        nssm start $ServiceName
        Write-Success "NSSM service '$ServiceName' created and started (backend on port $BackendPort)"
    } else {
        Write-Host "[INFO] NSSM not available. Falling back to Scheduled Task..." -ForegroundColor Yellow

        # Create a simple service wrapper script
        $serviceScript = "$InstallDir\service.bat"
        @"
@echo off
cd /d "$InstallDir"
node apps/server/dist/index.js
"@ | Set-Content $serviceScript

        $action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$serviceScript`"" -WorkingDirectory $InstallDir
        $trigger = New-ScheduledTaskTrigger -AtStartup
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
        Register-ScheduledTask -TaskName $ServiceName -Action $action -Trigger $trigger -Settings $settings -Description "GridVision SCADA Server" -RunLevel Highest -Force | Out-Null
        Start-ScheduledTask -TaskName $ServiceName -ErrorAction SilentlyContinue
        Write-Success "Scheduled task '$ServiceName' created for auto-start (backend on port $BackendPort)"
    }
}

# --- Start Frontend Dev Server ---
Write-Step "Starting frontend dev server on port $Port..."
$frontendScript = "$InstallDir\start-frontend.bat"
@"
@echo off
cd /d "$InstallDir\apps\web"
npx vite --port $Port
"@ | Set-Content $frontendScript

# Start the frontend as a background process
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$frontendScript`"" -WorkingDirectory "$InstallDir\apps\web" -WindowStyle Hidden
Write-Success "Frontend dev server starting on http://localhost:$Port"

# --- Create Desktop Shortcut ---
Write-Step "Creating shortcuts..."
$WshShell = New-Object -ComObject WScript.Shell

# Desktop
$shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\GridVision SCADA.lnk")
$shortcut.TargetPath = "http://localhost:$Port"
$shortcut.Description = "GridVision SCADA Dashboard"
$shortcut.Save()

# Start Menu
$startMenuDir = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\GridVision SCADA"
if (-not (Test-Path $startMenuDir)) { New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null }

$shortcut2 = $WshShell.CreateShortcut("$startMenuDir\GridVision SCADA.lnk")
$shortcut2.TargetPath = "http://localhost:$Port"
$shortcut2.Description = "GridVision SCADA Dashboard"
$shortcut2.Save()

$shortcut3 = $WshShell.CreateShortcut("$startMenuDir\GridVision Dev Server.lnk")
$shortcut3.TargetPath = "cmd.exe"
$shortcut3.Arguments = "/k cd /d `"$InstallDir`" && pnpm dev"
$shortcut3.Description = "Start GridVision in Development Mode"
$shortcut3.Save()

Write-Success "Shortcuts created"

# --- Post-Install Health Check ---
Write-Host ""
Write-Host "--- Post-Install Verification ---" -ForegroundColor Yellow
Write-Step "Waiting for backend server to start..."
$healthOk = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $healthOk = $true
            break
        }
    } catch { }
    Start-Sleep -Seconds 2
    Write-Host "  Attempt $i/30 - waiting for server..." -ForegroundColor Gray
}

if ($healthOk) {
    Write-Success "Health check passed - backend server is running on port $BackendPort"
} else {
    Write-Host "[WARN] Health check did not pass within 60 seconds." -ForegroundColor Yellow
    Write-Host "       The server may still be starting. Check manually:" -ForegroundColor Yellow
    Write-Host "       Invoke-WebRequest http://localhost:$BackendPort/api/health" -ForegroundColor Gray
}

# --- Done ---
Write-Host ""
Write-Host "  ========================================" -ForegroundColor Green
Write-Host "   Installation Complete!" -ForegroundColor Green
Write-Host "  ========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Install Location : $InstallDir" -ForegroundColor White
Write-Host "  Backend API      : http://localhost:$BackendPort" -ForegroundColor White
Write-Host "  Frontend (Dev)   : http://localhost:$Port" -ForegroundColor White
Write-Host "  Default Login    : admin@gridvision.local / admin123" -ForegroundColor White
Write-Host ""
Write-Host "  Quick Start:" -ForegroundColor Yellow
Write-Host "    cd `"$InstallDir`"" -ForegroundColor Gray
Write-Host "    pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  To uninstall:" -ForegroundColor Yellow
Write-Host "    ./windows-setup.ps1 -Uninstall" -ForegroundColor Gray
Write-Host ""

# Open browser
$openBrowser = Read-Host "Open GridVision in browser now? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process "http://localhost:$Port"
}
