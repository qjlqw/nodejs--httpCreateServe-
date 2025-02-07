const { exec } = require("child_process");

// 设置要执行的 git 命令
const pullCommand =
  "git -C https://github.com/qjlqw/nodejs--httpCreateServe-.git pull origin main";
const pushCommand =
  "git -C https://github.com/qjlqw/nodejs--httpCreateServe-.git push github main";

function gitCommitGithub(callback) {
  // 执行 git pull 命令
  exec(pullCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行 git pull 命令时出错: ${error}`);
      return res.status(500).send("Error pulling from Gitee");
    }

    // 执行 push 命令
    exec(pushCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error pushing to GitHub: ${error.message}`);
        return res.status(500).send("Error pushing to GitHub");
      }
      console.log(`Push output: ${stdout}`);
      res.status(200).send("Success");
    });
  });
}
