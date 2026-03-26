// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract SmartRewardDAO {
    uint256 public constant JOIN_FEE = 0.03 ether;
    address public owner;
    uint256 public totalMembers;
    uint256 public rewardPool;
    uint256 public ownerFund;
    uint256 public reserveFund;
    bool public paused;
    
    event MemberJoined(address indexed member, uint256 amount);
    event AutoPayout(address indexed recipient, uint256 amount, string reason);
    event OwnerWithdrawn(uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function join() external payable {
        require(msg.value == JOIN_FEE, "Send exactly 0.03 BNB");
        require(!paused, "System paused");
        
        (uint256 ownerP, uint256 rewardP, uint256 reserveP) = getCurrentPercentages();
        
        ownerFund += msg.value * ownerP / 100;
        rewardPool += msg.value * rewardP / 100;
        reserveFund += msg.value * reserveP / 100;
        
        totalMembers++;
        emit MemberJoined(msg.sender, msg.value);
        
        uint256 instantBonus = (msg.value * rewardP / 100) * 10 / 100;
        if (instantBonus > 0 && rewardPool >= instantBonus) {
            rewardPool -= instantBonus;
            (bool success, ) = msg.sender.call{value: instantBonus}("");
            if (success) {
                emit AutoPayout(msg.sender, instantBonus, "instant_bonus");
            }
        }
    }
    
    function getCurrentPercentages() public view returns (uint256 ownerP, uint256 rewardP, uint256 reserveP) {
        reserveP = 20;
        if (totalMembers <= 100) return (60, 20, 20);
        if (totalMembers <= 500) return (55, 25, 20);
        if (totalMembers <= 1000) return (50, 30, 20);
        if (totalMembers <= 2500) return (45, 35, 20);
        if (totalMembers <= 5000) return (40, 40, 20);
        if (totalMembers <= 10000) return (35, 45, 20);
        return (30, 50, 20);
    }
    
    function withdrawOwnerFund(uint256 amount) external onlyOwner {
        require(amount <= ownerFund, "Insufficient owner fund");
        ownerFund -= amount;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
        emit OwnerWithdrawn(amount);
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function getSystemInfo() external view returns (
        uint256 _totalMembers,
        uint256 _rewardPool,
        uint256 _ownerFund,
        uint256 _reserveFund,
        uint256 _totalFunds
    ) {
        return (totalMembers, rewardPool, ownerFund, reserveFund, rewardPool + ownerFund + reserveFund);
    }
}
