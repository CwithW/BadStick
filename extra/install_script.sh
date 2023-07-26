#!/bin/sh -e

# 1. move nodejs to /root/node
# download node-v18.15.0-linux-arm64.tgz from https://nodejs.org/dist/v18.15.0/node-v18.15.0-linux-arm64.tar.xz
tar -zxf node-v18.15.0-linux-arm64.tgz
rm -rf node-v18.15.0-linux-arm64.tgz
mv node-v18.15.0-linux-arm64 /root/node
chmod +x /root/node/bin/node

# 2. move client to /root/client
tar -zxvf ./dist.tgz
rm -rf ./dist.tgz
mv ./dist /root/client

# 3. write autostart into /etc/rc.local
cat <<EOF > /etc/rc.local
#!/bin/sh -e

cd /root/client
/root/node/bin/node app.js
EOF
chmod +x /etc/rc.local

# 4. it is done
echo "done"