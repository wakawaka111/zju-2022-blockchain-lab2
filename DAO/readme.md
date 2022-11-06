## 功能和实现分析
1.每个同学可以点击“领取通证积分”获得初始通证积分
代码实现：
```solidity
 function airdrop() external {
        require(claimedAirdropPlayerList[msg.sender] == false, "This user has claimed airdrop already");
        _mint(msg.sender, 10000);
        claimedAirdropPlayerList[msg.sender] = true;
    }
```
在前端代码中调用myERC20Contract.methods.airdrop().send({from: account}）即可获取初始积分。
2.每个同学在应用中可以：
2.1使用一定数量通证积分，输入提案内容，点击"确认提案"按钮发起关于该社团进行活动或制定规则的提案
代码实现：
```solidity
function propose(string memory n ) external{
        //TODO 是否要检查看还有余额发起提案
        studentERC20.transferFrom(msg.sender, address(this), cons);//从学生地址中减少代币
        proposals[proposal_num].index=proposal_num;
        proposals[proposal_num].proposer=msg.sender;
        proposals[proposal_num].startTime=block.timestamp;
        proposals[proposal_num].duration=300;
        proposals[proposal_num].name=n;
        proposals[proposal_num].votecount=0;
        proposals[proposal_num].reward=0;
        proposal_num++;
    }
```
再在前端代码中调用该方法，其中输入变量n为用户在前端输入的提案内容。
2.2提案发起一段时间内，用户可使用一定数量通证积分对提案进行投票：首先需要输		入相应提案的编号，再点击"赞同"或"反对"按钮
代码实现：
```solidity
//赞成
    function  approve(uint32 proindex) external{
        studentERC20.transferFrom(msg.sender, address(this), cons);//从学生地址中减少代币
        Voter storage sender = voters[msg.sender];//获取投票者
        Proposal storage proposal=proposals[proindex];//获取提案
        require(sender.votenum<votelimit,"The number of votes exceeds the upper limit");//判断投票次数是否超过上限
        require(block.timestamp<=proposal.startTime+proposal.duration,"Voting time is up");//投票时间已到
        sender.votenum+=1;//投票次数+1
        proposal.votecount+=1;//获得支持票+1
    }
    //反对
    function  object(uint32 proindex) external{
        studentERC20.transferFrom(msg.sender, address(this), cons);//从学生地址中减少代币
        Voter storage sender = voters[msg.sender];//获取投票者
        Proposal storage proposal=proposals[proindex];//获取提案
        require(sender.votenum<votelimit,"The number of votes exceeds the upper limit");//判断投票次数是否超过上限
        require(block.timestamp<=proposal.startTime+proposal.duration,"Voting time is up");//投票时间已到
        sender.votenum+=1;//投票次数+1
        proposal.votecount-=1;//反对票-1
    }
```
2.3提案投票时间截止后，赞成数大于反对数的提案通过，通过管理员对提案发起者进		行积分奖励
代码实现：
```solidity
function reward()public{
        for(uint32 i=0;i<proposal_num;i++){
            Proposal storage proposal=proposals[i];//获取提案
            if(block.timestamp>(proposal.startTime+proposal.duration) && proposal.votecount>0 && proposal.reward==0){
                proposal.reward=1;
            }
        }
    }
```
在前端调用该方法后再获取该提案结构体中的reward值，若为1，则调用MyERC20.sol中的reward方法进行积分奖励
## 如何运行
1.新建ganache测试环境并启动，将端口号配置为8545
2.将ganache的账户信息和网络信息写到hardhat配置文件中
3.进入DAO/contracts,输入npx hardhat run scripts/deploy.ts  --network ganache 部署合约拿到地址，并将得到的地址写入DAO/frontend/src/utils/contract-addresses.json中
4.进入DAO/frontend 输入npm run start，浏览器中访问：http://localhost:3000，即可开始测试
## 成功界面截图
![image.png](https://cdn.nlark.com/yuque/0/2022/png/28264530/1667742371067-9730cb13-fd24-4722-8d4f-2d0fc667ce2c.png#averageHue=%23191613&clientId=u3a778359-cadd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=78&id=ue6a1e29e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=98&originWidth=959&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16920&status=done&style=none&taskId=ufa98b528-4384-458b-805f-726dde4455d&title=&width=767.2)



![image.png](https://cdn.nlark.com/yuque/0/2022/png/28264530/1667742433347-4cd40e63-b6cf-4b72-878d-a26339b062c8.png#averageHue=%23dcdad7&clientId=u3a778359-cadd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=470&id=ubaf09e1d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=588&originWidth=1481&originalType=binary&ratio=1&rotation=0&showTitle=false&size=101658&status=done&style=none&taskId=ubd912efc-4dc2-4042-88e2-ee0bd0267b3&title=&width=1184.8)



![image.png](https://cdn.nlark.com/yuque/0/2022/png/28264530/1667742521834-92cb4b0c-362a-494c-8159-c886e8111f47.png#averageHue=%23b9bcb1&clientId=u3a778359-cadd-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=667&id=u14698237&margin=%5Bobject%20Object%5D&name=image.png&originHeight=834&originWidth=966&originalType=binary&ratio=1&rotation=0&showTitle=false&size=203277&status=done&style=none&taskId=u0b0fd993-5188-42e6-acad-d0da1961093&title=&width=772.8)
