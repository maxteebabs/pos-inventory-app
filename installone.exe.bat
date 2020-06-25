@ECHO OFF
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)
ECHO WELCOME TO POSdb
echo %cd%
cd C:\
mkdir data
cd C:\data
mkdir log
sc.exe create MongoDB binPath= "\"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe\" --service --config=\"C:\Program Files\MongoDB\Server\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"
net start MongoDB

cd C:\Program Files\MongoDB\Server\4.0\bin

pushd %~dp0
npm start
cls
EXIT