module.exports = {
  apps : [{
    name: 'myApp',
    script: '2.pm2-server.js', // 要执行的文件
    args: 'one two', // node XXX one two
    instances: 4, // 实例个数
    autorestart: true, // 是否改完代码保存之后要重启
    watch: '.', // 监控  默认是 false
    max_memory_restart: '10', // 重启内存最大 1g
    env: {
      NODE_ENV: "development",
    },
    env_production: { // 配置环境变量
      NODE_ENV: "production",
    }
  }],
  // pm2 可以搬我们实现自动发布 ， 可以和git一同使用
  deploy : {
    production : {
      user : 'SSH_USERNAME', // 买的服务器的用户名
      host : 'SSH_HOSTMACHINE', // 服务器的主机名
      ref  : 'origin/master', // 分支
      repo : 'GIT_REPOSITORY', // 仓库地址 可以ssh-免密的，也可以https-加密的
      path : 'DESTINATION_PATH', // 部署到服务器哪个目录下
      'pre-deploy-local': '',
      // 进到目录下 执行npm install 并且 重启当前的配置文件 且配置好环境变量（条件是服务器上要安装好了pm2）
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
