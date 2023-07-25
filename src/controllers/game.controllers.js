export async function getGames(req, res) {
  try {
    //chamar pelo banco que tem o nome de todos os jogos
    // colocar res.send(nome_do_banco_jogos)
  
    // Tem que vir no formato:
    // [
    //   {
    //     id: 1,
    //     name: 'Banco Imobiliário',
    //     image: 'http://',
    //     stockTotal: 3,
    //     pricePerDay: 1500
    //   },
    //   {
    //     id: 2,
    //     name: 'Detetive',
    //     image: 'http://',
    //     stockTotal: 1,
    //     pricePerDay: 2500
    //   },
    // ]
  
  } catch (err) {
    return res.status(500).send(err.message)
  }
};

export async function postGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
   if('') {
 //ver se o nome_do_jogo já está no banco, se estiver, retornar status 409 
   }
   
  //Chamar o banco com o nome que tem todos os jogos e add nele esse objeto INSERT({value: value.....}) 
   res
      .status(201)
      .send({
        name: name,
        image: image,
        stockTotal: stockTotal,
        pricePerDay: pricePerDay,
      }); //se der certo é só para responder com 201 e nada mais
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
