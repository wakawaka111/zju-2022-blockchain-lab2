import {Button, Image} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {lotteryContract, myERC20Contract, web3} from "../../utils/contracts";
import './index.css';
import moment from 'moment'
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const LotteryPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [cons, setCons] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')
    //const [proposalNumber, setproposalNumber] = useState(0)
    const [proindex,setProindex] = useState(0);
    const [proname,setProname]=useState('content')
    const [shownlist,setShownlist]:any=useState([])
    const [time,setTime]:any=useState([])
    const[votenum,setVotenum]=useState(0)
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getDAOContractInfo = async () => {
            if (lotteryContract) {
                const ma = await lotteryContract.methods.manager().call()
                setManagerAccount(ma)
                const cons = await lotteryContract.methods.cons().call()
                setCons(cons)

            } else {
                alert('Contract not exists.')
            }
        }

        getDAOContractInfo()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (lotteryContract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                const vn=await lotteryContract.methods.getVoternum(account).call()
                setVotenum(vn)
            } else {
                alert('Contract not exists.')
            }
        }
        if(account !== '') {
            getAccountInfo()
        }
    }, [account])
    //领取积分
    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                await lotteryContract.methods.init().send({
                    from: account
                })
                alert('You have claimed Stu Token.')
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }
    //确认发布提案
    const onPlay = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (lotteryContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(lotteryContract.options.address, cons).send({
                    from: account
                })
                await lotteryContract.methods.propose(proname).send({
                    from: account
                })

    let list=[]
    let time=[]
    let count=await lotteryContract.methods.proposal_num().call()
    for(let i=0;i<count;i++){
        let index=await lotteryContract.methods.getProindex(i).call()
        let name=await lotteryContract.methods.getProname(i).call()
        let score=await lotteryContract.methods.getProvotecount(i).call()
        let reward=await lotteryContract.methods.getProreward(i).call()
        list.push({key:i,index:index,name:name,score:score,reward:reward})
    }
    setShownlist(list)

                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                alert('You have proposed a proposal')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    //投票
    const onApprove= async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (lotteryContract && myERC20Contract) {
            let votenum=await lotteryContract.methods.getVoternum(account).call()
            if(votenum>2){
                alert('超出了投票次数限制')
                return
            }
            try {
                await myERC20Contract.methods.approve(lotteryContract.options.address, cons).send({
                    from: account
                })
                await lotteryContract.methods.approve(proindex).send({
                    from: account
                })
                let list=[]
                let count=await lotteryContract.methods.proposal_num().call()
                for(let i=0;i<count;i++){
                    let index=await lotteryContract.methods.getProindex(i).call()
                    let name=await lotteryContract.methods.getProname(i).call()
                    let score=await lotteryContract.methods.getProvotecount(i).call()
                    let reward=await lotteryContract.methods.getProreward(i).call()
                    list.push({key:i,index:index,name:name,score:score,reward:reward})
                }
                setShownlist(list)
                votenum++
                setVotenum(votenum)
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                alert('You have approved a proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onObject= async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (lotteryContract && myERC20Contract) {
            let votenum=await lotteryContract.methods.getVoternum(account).call()
            if(votenum>2){
                alert('超出了投票次数限制')
                return
            }
            try {
                await myERC20Contract.methods.approve(lotteryContract.options.address, cons).send({
                    from: account
                })
                await lotteryContract.methods.object(proindex).send({
                    from: account
                })
                let list=[]
                let count=await lotteryContract.methods.proposal_num().call()
                for(let i=0;i<count;i++){
                    let index=await lotteryContract.methods.getProindex(i).call()
                    let name=await lotteryContract.methods.getProname(i).call()
                    let score=await lotteryContract.methods.getProvotecount(i).call()
                    let reward=await lotteryContract.methods.getProreward(i).call()
                    list.push({key:i,index:index,name:name,score:score,reward:reward})
                }
                setShownlist(list)
                votenum++
                setVotenum(votenum)
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                alert('You have objected a proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const onReward = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        } else if(account !== managerAccount) {
            alert('Only manager can invoke this method.')
            return
        }
        if (lotteryContract) {
            try {

                await lotteryContract.methods.reward().send({
                    from: account
                })
                let count=await lotteryContract.methods.proposal_num().call()
                // for(let i=0;i<count;i++){
                //     let score=await lotteryContract.methods.getProvotecount(i).call()
                //     if(score>0){
                //         let addr=await lotteryContract.methods.getProproposer(i).call()
                //         await myERC20Contract.methods.reward(addr).send({from:account})
                //     }
                // }
                let list=[]
                for(let i=0;i<count;i++){
                    let index=await lotteryContract.methods.getProindex(i).call()
                    let name=await lotteryContract.methods.getProname(i).call()
                    let score=await lotteryContract.methods.getProvotecount(i).call()
                    let reward=await lotteryContract.methods.getProreward(i).call()
                    list.push({key:i,index:index,name:name,score:score,reward:reward})
                    if(score>0){
                               let addr=await lotteryContract.methods.getProproposer(i).call()
                                await myERC20Contract.methods.reward(addr).send({from:account})
                          }
                }
                setShownlist(list)
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                alert('You have reward proposers.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }
    return (
        <div className='container'>
            <Image
                width='100%'
                height='150px'
                preview={false}
                src={Header}
            />
            <Button onClick={onClaimTokenAirdrop}>领取通证积分</Button>
            <div className='main'>
                <h1>学生社团组织管理平台</h1>
                <div>管理员地址：{managerAccount}</div>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <div>当前用户拥有通证积分数量：{account === '' ? 0 : accountBalance}   当前用户已投票{votenum}次</div>
                </div>
                <div>花费{cons}通证积分，发起提案</div>
                <div>现有提案如下:</div>
                <div>
                    <table>
                        {shownlist.map(((item:any) =>
                                <tr><td key={item.key}>编号:{item.index} 内容:{item.name} 得分:{item.score}  是否通过:{item.reward}</td></tr>
                        ))}
                    </table>
                </div>
                <div>
                    <input
                        value={proname}
                        type="text"
                        onChange={(e)=>{
                            const val =e.target.value;
                            setProname(val);
                        }}
                        //去除自动填充提示
                        autoComplete="off"
                    />
                    <Button style={{width: '200px'}} onClick={onPlay}>确认提案</Button>
                </div>
                <div className='operation'>
                    <div >请输入提案编号，并花费{cons}通证积分进行投票</div>
                    <div>
                        <input
                            value={proindex}
                            type="text"
                            onChange={(e)=>{
                                const val =e.target.value;
                                setProindex(Number(val));
                            }}
                            //去除自动填充提示
                            autoComplete="off"
                        />

                    </div>
                    <div className='buttons'>
                        <Button style={{width: '200px'}} onClick={onApprove}>赞同</Button>
                        <Button style={{width: '200px'}} onClick={onObject}>反对</Button>
                        <Button style={{width: '200px'}} onClick={onReward}>奖励(仅限管理员使用)</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LotteryPage