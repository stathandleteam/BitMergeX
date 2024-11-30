// chrome.action.onClicked.addlistener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: () => {
//             window.open('https://github.com/stacksimplify/chrome-extension-starter');
//         }
// });
// })
chrome.runtime.onInstalled.addListener(() => {
    console.log('Stacks Wallet Extension installed');
  });