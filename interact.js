const hre = require("hardhat");

async function main() {
  console.log("🔌 Connecting to SmartRewardDAO...");
  
  // آدرس قرارداد (از deploy.js بگیرید)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const SmartRewardDAO = await hre.ethers.getContractFactory("SmartRewardDAO");
  const dao = SmartRewardDAO.attach(contractAddress);
  
  console.log("\n📊 System Info:");
  const info = await dao.getSystemInfo();
  console.log(`   Total Members: ${info[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(info[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(info[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(info[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(info[4])} BNB`);
  
  console.log("\n👤 Getting signers...");
  const [owner, user1, user2] = await hre.ethers.getSigners();
  console.log(`   Owner: ${owner.address}`);
  console.log(`   User1: ${user1.address}`);
  console.log(`   User2: ${user2.address}`);
  
  console.log("\n💰 User1 joining the DAO...");
  const joinFee = await dao.JOIN_FEE();
  console.log(`   Join fee: ${hre.ethers.formatEther(joinFee)} BNB`);
  
  const tx1 = await dao.connect(user1).join({ value: joinFee });
  await tx1.wait();
  console.log(`   ✅ User1 joined!`);
  
  console.log("\n💰 User2 joining the DAO...");
  const tx2 = await dao.connect(user2).join({ value: joinFee });
  await tx2.wait();
  console.log(`   ✅ User2 joined!`);
  
  console.log("\n📊 Updated System Info:");
  const newInfo = await dao.getSystemInfo();
  console.log(`   Total Members: ${newInfo[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(newInfo[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(newInfo[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(newInfo[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(newInfo[4])} BNB`);
  
  console.log("\n👑 Owner withdrawing from Owner Fund...");
  const ownerFund = await dao.ownerFund();
  console.log(`   Owner Fund balance: ${hre.ethers.formatEther(ownerFund)} BNB`);
  
  if (ownerFund > 0) {
    const tx3 = await dao.withdrawOwnerFund(ownerFund);
    await tx3.wait();
    console.log(`   ✅ Withdrawn ${hre.ethers.formatEther(ownerFund)} BNB`);
  }
  
  console.log("\n📊 Final System Info:");
  const finalInfo = await dao.getSystemInfo();
  console.log(`   Total Members: ${finalInfo[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(finalInfo[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(finalInfo[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(finalInfo[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(finalInfo[4])} BNB`);
  
  console.log("\n✅ All interactions completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
