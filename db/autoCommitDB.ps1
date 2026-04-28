# C:\Scripts\TestTask.ps1
# 功能：向测试文件追加一行文字（含时间），用于验证计划任务是否执行

# C:\Scripts\ZipAndPush.ps1
# 功能：压缩指定 .bak 为 .zip，然后 git add/commit/push
# 适用：Windows Server 2019

$ErrorActionPreference = "Stop"  # 让出错直接抛异常，便于统一捕获

# ========== 配置 ==========
#$Directory  = (Get-Location).Path              # 等价于 %cd%
$Directory = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetFile = "twitterG.bak"
$ZipFile    = "twitterG.zip"
$GitPath    = "C:\Users\Administrator\AppData\Local\GitHubDesktop\app-3.0.8\resources\app\git\cmd\git.exe"
$LogFile    = Join-Path $Directory "commitLog.txt"

$TargetPath = Join-Path $Directory $TargetFile
$ZipPath    = Join-Path $Directory $ZipFile

function Write-Log {
    param(
        [string]$Message
    )
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $LogFile -Value $line -Encoding utf8
}

Write-Log  "Processing..."
Write-Log  "Directory : $Directory"
Write-Log  "Target    : $TargetPath"
Write-Log  "Zip       : $ZipPath"

try {
    # 0) 检查 git.exe 是否存在
    if (-not (Test-Path $GitPath)) {
        throw "git.exe 不存在：$GitPath"
    }

    # 1) 检查目标文件是否存在
    if (-not (Test-Path $TargetPath)) {
        throw "Target file $TargetFile does not exist!"
    }

    # 2) 删除旧 zip
    if (Test-Path $ZipPath) {
        Remove-Item -Path $ZipPath -Force
    }

    # 3) 压缩生成 zip
    Compress-Archive -Path $TargetPath -DestinationPath $ZipPath -Force

    # 4) 检查 zip 是否生成成功
    if (-not (Test-Path $ZipPath)) {
        throw "Zip file creation failed!"
    }
    Write-Log  "Zip completed"

    # 5) 进入仓库目录（当前目录）
    Set-Location -Path $Directory

    # 6) git add
    & $GitPath add $ZipFile

    # 7) git commit
    # 如果没有变化可提交，git commit 会返回非0；这里做个判断更友好
    $status = & $GitPath status --porcelain
    if (-not $status) {
        Write-Log "No changes to commit."
    } else {
        & $GitPath commit -m "Add new zip file"
    }
    #Write-Log ("Running as: " + [System.Security.Principal.WindowsIdentity]::GetCurrent().Name)

    Write-Log  "git commit completed"

    # 8) git push
    & $GitPath push

    Write-Log "All steps completed!"
    exit 0
}
catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    exit 1
}
