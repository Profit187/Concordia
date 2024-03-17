export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
cd ..
pm2 start pm2.json --env production