#!/bin/bash

echo build project, execute 'mvn clean package -Dmaven.test.skip'
~/maven/bin/mvn clean package -Dmaven.test.skip

echo deploy, execute 'cp ~/obconfig/target/obconfig.war ~/tomcat/webapps/ROOT.war'
cp ~/obconfig/target/obconfig.war ~/tomcat/webapps/ROOT.war

echo remove build result
rm -rf ~/obconfig/target

echo will restart app ......

jvm_id=`ps -ef|grep java|grep -v grep|awk '{print $2}'`
kill -9 $jvm_id
rm -rf /home/admin/tomcat/webapps/ROOT
sh /home/admin/tomcat/bin/startup.sh

echo finish
