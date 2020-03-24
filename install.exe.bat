@ECHO OFF
ECHO WELCOME TO POSdb
echo %cd%
cd C:\
mkdir data
cd C:\data
mkdir log
sc.exe create MongoDB binPath= "\"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe\" --service --config=\"C:\Program Files\MongoDB\Server\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"
net start MongoDB
cls
cd C:\Program Files\MongoDB\Server\4.0\bin

pushd %~dp0
npm run server
cls
copy "C:\Remoting.config-Training" "C:\Remoting.config"
start C:\ThirdParty.exe
EXIT
