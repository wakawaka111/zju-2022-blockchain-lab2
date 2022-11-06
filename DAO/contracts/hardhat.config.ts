import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // Solidity compiler version
  solidity: "0.8.0",
  networks: {
    ganache: {
      // Change the url according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // Change these accounts private keys according to your ganache configuration.
      accounts: [
       'a69f7647ba3329546a9df9e4d0e14338b2f0faadaa2dd6a2045122e3918949a5',
        '1d768c5332d245020bfd3ee69b4fa5ef3ba582c0418948882b8a2082af92b20f',
        '4d61e513ab8f972a4ac602e4313c9c6a3e71e8a062fdcdff0030765e8d3c834e',
        '61b8d392d53ca0aa44b4b57d7d15d6a4216c4797d44f2fcd00088ac7afd146dc',
      ]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
