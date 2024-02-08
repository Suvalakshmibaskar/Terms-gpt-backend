echo ===================================================
echo Autodeploy server
echo ===================================================
echo Connecting to remote server...
ssh liv-dev  'bash -i'  <<-'ENDSSH'
    #Connected
    cd livyana-server/
    git pull origin develop
    npm install
    pm2 stop livyana
    pm2 start ecosystem.config.js
    pm2 logs livyana
    # exit