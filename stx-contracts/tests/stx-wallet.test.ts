import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

// Access simnet accounts
const accounts = simnet.getAccounts();
const owner =  accounts.get("deployer")!;
const userA = accounts.get("wallet_1")!;
const userB = accounts.get("wallet_2")!;
const userC = accounts.get("wallet_3")!;


describe("STX Wallet Contract Tests", () => {

  // Check if Simnet is properly initialized
  it("should ensure simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  // Owner deposits STX to the contract
  it("owner deposits STX to contract", () => {
    const { events, result } = simnet.callPublicFn(
      "stx-wallet",
      "deposit",
      [Cl.uint(10000)],
      owner
    );

    // Check the function result
    expect(result).toBeOk(Cl.bool(true));

    // Verify the contract balance after deposit
    const contractBalance = simnet.callReadOnlyFn(
      "stx-wallet",
      "get-contract-balance",   // Read-only function to get contract balance
      [],                        // No arguments required
      owner
    );
    expect(contractBalance.result).toBeUint(10000);
  });

  // // User deposits STX to the contract
  it("user deposits STX to contract", () => {
    const {events, result} = simnet.callPublicFn(
      "stx-wallet",
      "deposit",
      [Cl.uint(10000)],
      userA
    );
    
     // Check the function result
     expect(result).toBeOk(Cl.bool(true));

     // Verify the contract balance after deposit
     const contractBalance = simnet.callReadOnlyFn(
       "stx-wallet",
       "get-contract-balance",   // Read-only function to get contract balance
       [],                        // No arguments required
       owner
     );
     expect(contractBalance.result).toBeUint(10000);
  });

  // Transfer from user A to user B
  it("user transfers STX to another user and confirm balance", () => {
    const {events} = simnet.callPublicFn(
      "stx-wallet",
      "send-stx-memo",
      [
        Cl.uint(10000),
        Cl.principal(userA),
        Cl.principal(userB),
        Cl.none(),
      ],
      userA
    );

    // Validate STX transfer event
    expect(events[0]).toMatchObject({
      event: "stx_transfer_event",
      data: {
        sender: userA,
        memo: "",
        recipient: userB,
        amount: "10000",
      },
    });

    const { result:userAresult } = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userA)], owner);    
    // Check the balance result for userA
    expect(userAresult).toBeUint(99999999990000);

    const {result: userBresult } = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userB)], owner);
    // Check the contract's balance result for userB
    expect(userBresult).toBeUint(100000000010000);

  });


});

describe("send-stx-many contract tests", () => {
  it("should handle multiple transfers correctly", () => {

    // Create a list of transfer data to pass to the contract
    const transfers = [
      {
        'amount': Cl.uint(10000),
        'sender': Cl.principal(owner),
        'recipient': Cl.principal(userA),
      },
      {
        'amount': Cl.uint(5000),
        'sender': Cl.principal(owner),
        'recipient': Cl.principal(userB),
      },
    ];

    // Call the send-stx-many function with the transfers list
    const result = simnet.callPublicFn(
      "stx-wallet",        // Contract name
      "send-stx-many",     // Function to call
      [Cl.list(transfers.map(t => Cl.tuple(t)))],// Pass the transfers as a list of tuples
      owner  // Transaction sender
    );

    // Check if the result is ok
    expect(result).toMatchObject({});

    // Further assertions: Check the balances of the recipients after the transfers
    const recipient1Balance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userA)], owner);
    const recipient2Balance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userB)], owner);

    // Check the contract's balance result
    const ownerBalance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(owner)], owner);

    // Check the contract's balance result
    const { result: contractBalance } = simnet.callReadOnlyFn("stx-wallet", "get-contract-balance", [], owner);

    expect(recipient1Balance.result).toBeUint(100000000010000);

    expect(recipient2Balance.result).toBeUint(100000000005000);

    expect(ownerBalance.result).toBeUint(99999999985000)

    expect(contractBalance).toBeUint(0);

  });
});

describe("send-stx-many-memo contract tests", () => {
  it("should handle multiple transfers with memos correctly", () => {

    // Create a list of transfer data with memos
    const transfersWithMemo = [
      {
        'amount': Cl.uint(10000),
        'sender': Cl.principal(owner),
        'recipient': Cl.principal(userA),
        'memo': Cl.some(Cl.buffer(Buffer.from("Memo for userA", "utf-8"))),
      },
      {
        'amount': Cl.uint(5000),
        'sender': Cl.principal(owner),
        'recipient': Cl.principal(userB),
        'memo': Cl.some(Cl.buffer(Buffer.from("Memo for userB", "utf-8"))),
      },
      {
        'amount': Cl.uint(500),
        'sender': Cl.principal(owner),
        'recipient': Cl.principal(userC),
        'memo': Cl.none(), // No memo
      },
    ];

    // Call the send-stx-many-memo function with the transfers list
    const { result, events } = simnet.callPublicFn(
      "stx-wallet",        // Contract name
      "send-stx-many-memo",// Function to call
      [Cl.list(transfersWithMemo.map(t => Cl.tuple(t)))], // List of tuples
      owner  // Transaction sender
    );

    // Check if the result is ok
    expect(result).toMatchObject({});

    // Check the balance updates for each recipient
    const recipientABalance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userA)], owner);
    const recipientBBalance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userB)], owner);
    const recipientCBalance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(userC)], owner);
    const ownerBalance = simnet.callReadOnlyFn("stx-wallet", "get-balance", [Cl.principal(owner)], owner);

    // Check the contract's balance result
    const { result: contractBalance } = simnet.callReadOnlyFn("stx-wallet", "get-contract-balance", [], owner);

    // Validate recipient balances
    expect(recipientABalance.result).toBeUint(100000000010000);
    expect(recipientBBalance.result).toBeUint(100000000005000);
    expect(recipientCBalance.result).toBeUint(100000000000500);

    // Validate the owner's balance after the transfers
    expect(ownerBalance.result).toBeUint(99999999984500);

    // Ensure contract balance is updated
    expect(contractBalance).toBeUint(0);

  
  });
});