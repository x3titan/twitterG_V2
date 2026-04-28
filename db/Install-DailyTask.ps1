# 功能：创建一个每天自动执行的计划任务，运行 C:\Scripts\TestTask.ps1
# 说明：使用 SYSTEM 账户运行，避免账号/权限问题

$TaskName = "Daily_Commit_Database_Task"
#$CurrentDir = (Get-Location).Path
$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptPath = Join-Path $CurrentDir "autoCommitDB.ps1"

# 确保脚本存在
if (-not (Test-Path $ScriptPath)) {
    Write-Error "找不到任务脚本：$ScriptPath 。请先创建 autoCommitDB.ps1"
    exit 1
}

# 设定每天执行时间（你可以改成你想要的，比如 02:00）
$DailyTime = "02:00"

# 任务执行命令（关键：ExecutionPolicy Bypass，避免执行策略阻止）
$Action = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "{0}"' -f $ScriptPath

# 如果同名任务已存在，先删除（避免重复/冲突）
schtasks /Query /TN $TaskName *> $null
if ($LASTEXITCODE -eq 0) {
    schtasks /Delete /TN $TaskName /F | Out-Null
}

# 创建计划任务：每天 $DailyTime 执行，使用 SYSTEM 运行
#/RU "SYSTEM"
schtasks /Create `
  /TN $TaskName `
  /SC DAILY `
  /ST $DailyTime `
  /RU "Administrator" `
  /RP "*************" `
  /RL HIGHEST `
  /TR $Action `
  /F | Out-Null

Write-Host "已创建计划任务：$TaskName （每天 $DailyTime 执行）"
Write-Host "你可以用以下命令立刻测试一次："
Write-Host "schtasks /Run /TN `"$TaskName`""
Write-Host "你可以用以下命令删除任务："
Write-Host "schtasks /Delete /TN `"$TaskName`" /F"
 