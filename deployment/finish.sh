export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
pm2 start /home/ec2-user/concordia/pm2.config.cjs --env production