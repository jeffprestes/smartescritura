var contractAddress = "0x6a6AF8E449690Ca24eFB9ba57aa284B503540a5a";
var provider = new ethers.providers.Web3Provider(web3.currentProvider);
ethereum.enable();
var signer = provider.getSigner();
var contract = new ethers.Contract(contractAddress, contractAbi, signer);

function valorDepositado() {    
    var boxBalance = document.getElementById("boxBalance");
    console.log("valorDepositado - submitting the request");     
    contract.valorDepositado()
    .then( (resultFromContract) => {
        console.log("valorDepositado - result is", resultFromContract);
        boxBalance.innerHTML = resultFromContract;
    })
    .catch( (err) => {
        console.error(err);
        alert("A screen will be load asking to allow this page to connect with your Ethereum account.\nPlease give this permission to proceed.\nOr if you don't have an Ethereum account please install Metamask");
        ethereum.enable();
        alert("After you give the permission we are going to reload the page");
        document.location = "index.html";
    });
}



function buscaStatusContrato() {
    var status;
    var campoStatus = document.getElementById("campoStatus");     
    contrato.statusPagamentoAluguel()
    .then( (resultado) => {
        campoStatus.innerHTML = resultado;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });





function Assinar() {
    var textoCampo = document.frmStatus.txtStatusPagamentoAluguel.value;
    var caixaStatusTx = document.getElementById("caixaStatusTx");
    if (textoCampo.length === 8) {
        caixaStatusTx.innerHTML = "Enviando transação...";
        contrato.Assinar(textoCampo)
        .then( (transacao) => {
            console.log("registrarMudancaStatus - Transacao ", transacao);   
            caixaStatusTx.innerHTML = "Transação enviada. Aguardando processamento...";
            transacao.wait()
            .then( (resultado) => {
                buscaStatusContrato();
                caixaStatusTx.innerHTML = "Transação realizada.";
            })        
            .catch( (err) => {
                console.error("registrarMudancaStatus - Aguardando tx ser minerada");
                console.error(err);
                caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
            })
        })
        .catch( (err) => {
            console.error("registrarMudancaStatus");
            console.error(err);
            caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
        })
    }
}

    
    
    
    







function AssinarPagar() {
    var amount = document.frmPayment.amount.value;       
    if (amount<1000000000) {
        alert("You must pay a minimum of 1 gwei to the Contract");
        return false;
    }
    var motivation = document.frmPayment.motivation.value;
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Sending transaction...";
    var additionalSettings = {
        value: ethers.utils.parseUnits(amount, 'wei')
    }; 
    contract.AssinarPagar(motivation, additionalSettings)
    .then( (tx) => {
        console.log("AssinarPagar - Transaction ", tx);   
        boxCommStatus.innerHTML = "Transaction sent. Waiting for the result...";
        tx.wait()
        .then( (resultFromContract) => {
            console.log("AssinarPagar - the result was ", resultFromContract);
            valorDepositado();
            boxCommStatus.innerHTML = "Transaction executed.";
        })        
        .catch( (err) => {
            console.error("AssinarPagar - after tx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })
    .catch( (err) => {
        console.error("AssinarPagar - tx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Something went wrong: " + err.message;
    })
}
