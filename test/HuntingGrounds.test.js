import { expect } from "chai";
import hre from "hardhat";

describe("Dreadnaughties Core Contracts", function () {
  let huntingGrounds;
  let optionsMarket;
  let owner;
  let attacker;
  let defender;

  beforeEach(async function () {
    [owner, attacker, defender] = await hre.ethers.getSigners();

    const OptionsMarket = await hre.ethers.getContractFactory("OptionsMarket");
    optionsMarket = await OptionsMarket.deploy();

    const HuntingGrounds = await hre.ethers.getContractFactory("HuntingGrounds");
    huntingGrounds = await HuntingGrounds.deploy();

    // Link them together
    await optionsMarket.setHuntingGrounds(await huntingGrounds.getAddress());
    await huntingGrounds.setOptionsMarket(await optionsMarket.getAddress());
  });

  describe("HuntingGrounds Combat & Integration", function () {
    it("Should correctly resolve a battle and call OptionsMarket", async function () {
      const attackTx = await huntingGrounds.connect(attacker).executeAttack(
        3, 1, defender.address, 0, { value: hre.ethers.parseEther("0.1") }
      );

      await attackTx.wait();

      const battle = await huntingGrounds.battles(1);
      expect(battle.attacker).to.equal(attacker.address);
      expect(battle.roundsFought).to.equal(5n);

      const marketResolved = await optionsMarket.marketResolved(1);
      expect(marketResolved).to.equal(true);
    });
  });

  describe("OptionsMarket Security", function () {
    it("Should prevent arbitrary resolution", async function () {
      await expect(
        optionsMarket.connect(attacker).resolveMarket(1, 3, 2)
      ).to.be.revertedWith("Caller is not HuntingGrounds");
    });
    
    it("Should prevent division by zero gracefully in exercise options if no losing liquidity", async function () {
       await huntingGrounds.connect(attacker).executeAttack(
        5, 0, defender.address, 0, { value: hre.ethers.parseEther("0.1") }
       );

       await expect(
         optionsMarket.connect(attacker).exerciseOption(1)
       ).to.be.revertedWith("No winning tokens");
    });
  });
});
