// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already

import "./MyERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lottery {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        string name;       // proposal name
        // ...
        // TODO add any member if you want
        int votecount;//初始化为0，获得支持票+1,反对票-1;大于0即通过
        uint32 reward;//标记是否受过奖励

    }
    MyERC20 public studentERC20;
    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal

    // ...
    // TODO add any variables if you want
    address public manager; // 管理员，用来开奖和退款
    uint32 constant public cons=10;//投票消耗的代币
    uint32 constant public votelimit=3;//投票次数上限
    uint32 public proposal_num;//记录当前有多少提案,默认初始化为0
    struct Voter{
        uint32 votenum;//记录投票次数
        address voter;
    }
    mapping(address => Voter) public voters; // 此状态变量，address映射到每个Voter的struct
    constructor() {
        // maybe you need a constructor
        studentERC20 = new MyERC20("name", "symbol");
        manager = msg.sender;

    }
    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }
    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
    //进行初始化 包括获取初始代币并将投票次数置0
    function init()external{
        voters[msg.sender].voter=msg.sender;
        voters[msg.sender].votenum=0;
    }

    //提出提案
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
    //给通过的提案奖励
    function reward()public{
        for(uint32 i=0;i<proposal_num;i++){
            //Proposal storage proposal=proposals[i];//获取提案
            if(block.timestamp>(proposals[i].startTime+proposals[i].duration) && proposals[i].votecount>0 && proposals[i].reward==0){
                proposals[i].reward=1;
            }
        }
    }
    function getProindex(uint32 i) public view returns(uint32) {
        return proposals[i].index;
    }
    function getProproposer(uint32 i) public view returns(address) {
        return proposals[i].proposer;
    }
    function getProstartTime(uint32 i) public view returns(uint256) {
        return proposals[i].startTime;
    }
    function getProduration(uint32 i) public view returns(uint256) {
        return proposals[i].duration;
    }
    function getProname(uint32 i) public view returns(string memory){
        return proposals[i].name;
    }
    function getProvotecount(uint32 i) public view returns(int) {
        return proposals[i].votecount;
    }
    function getProreward(uint32 i) public view returns(uint32) {
        return proposals[i].reward;
    }
    function getProinvalid(uint32 i) public view returns(uint32) {
         if(block.timestamp>(proposals[i].startTime+proposals[i].duration))
            return 1;
        else return 0;
    }
    function getVoternum(address i)public view returns(uint32){
       return voters[i].votenum;
    }


}
