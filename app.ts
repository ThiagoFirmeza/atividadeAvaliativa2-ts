abstract class Item {
  protected nome: string;
  protected descricao: string;

  constructor(nome: string, descricao: string) {
    this.nome = nome;
    this.descricao = descricao;
  }

  abstract aplicarBeneficios(personagem: Personagem): void;
  abstract removerBeneficios(personagem: Personagem): void;
}

class ItemInventario {
  private quantidade: number;
  private item: Item;

  constructor(item: Item, quantidade: number) {
    this.item = item;
    this.quantidade = quantidade;
  }

  getItem(): Item {
    return this.item;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  adicionarQuantidade(qtd: number): void {
    this.quantidade += qtd;
  }

  reduzirQuantidade(qtd: number): void {
    this.quantidade -= qtd;
  }
}

class Arma extends Item {
  constructor(nome: string, descricao: string) {
    super(nome, descricao);
  }

  aplicarBeneficios(personagem: Personagem): void {
    personagem.forca += 10;
    personagem.defesa += 5;
  }

  removerBeneficios(personagem: Personagem): void {
    personagem.forca -= 10;
    personagem.defesa -= 5;
  }
}

class Pocao extends Item {
  constructor(nome: string, descricao: string) {
    super(nome, descricao);
  }

  aplicarBeneficios(personagem: Personagem): void {
    personagem.HP = Math.min(personagem.HP + personagem.HPMax * 0.5, personagem.HPMax);
    personagem.MP = Math.min(personagem.MP + personagem.MPMax * 0.2, personagem.MPMax);
  }

  removerBeneficios(personagem: Personagem): void {
    // Poções não removem benefícios.
  }
}

class Inventario {
  private itens: ItemInventario[] = [];
  private quantidadeMaximaItens: number;

  constructor(quantidadeMaximaItens: number) {
    this.quantidadeMaximaItens = quantidadeMaximaItens;
  }

  adicionarItem(item: Item, quantidade: number): void {
    for (let itemInventario of this.itens) {
      if (itemInventario.getItem().nome === item.nome) {
        itemInventario.adicionarQuantidade(quantidade);
        return;
      }
    }

    if (this.itens.length >= this.quantidadeMaximaItens) {
      throw new Error("Inventário está cheio");
    }

    this.itens.push(new ItemInventario(item, quantidade));
  }

  listarItens(): void {
    this.itens.forEach((itemInventario, index) => {
      console.log(`${index + 1} - ${itemInventario.getItem().nome} (${itemInventario.getQuantidade()})`);
    });
    console.log(`Total: ${this.itens.length}/${this.quantidadeMaximaItens}`);
  }

  obterItem(index: number): ItemInventario {
    if (index >= 0 && index < this.itens.length) {
      return this.itens[index];
    }
    throw new Error("Índice inválido");
  }
}

class ItemMenu {
  private opcao: number;
  private textoOpcao: string;

  constructor(opcao: number, textoOpcao: string) {
    this.opcao = opcao;
    this.textoOpcao = textoOpcao;
  }

  getOpcao(): number {
    return this.opcao;
  }

  getTextoOpcao(): string {
    return this.textoOpcao;
  }
}

class Menu {
  private itensMenu: ItemMenu[];

  constructor(itensMenu: ItemMenu[]) {
    this.itensMenu = itensMenu;
  }

  imprimirMenu(): number {
    this.itensMenu.forEach(itemMenu => {
      console.log(`${itemMenu.getOpcao()}. ${itemMenu.getTextoOpcao()}`);
    });

    const escolha = parseInt(prompt("Escolha uma opção:") || "0", 10);
    return escolha;
  }
}

class Personagem {
  public nome: string;
  public HP: number;
  public HPMax: number;
  public MP: number;
  public MPMax: number;
  public forca: number;
  public defesa: number;
  private inventario: Inventario;
  private arma: Arma | null = null;

  constructor(nome: string, HP: number, MP: number, forca: number, defesa: number, inventario: Inventario) {
    this.nome = nome;
    this.HP = HP;
    this.HPMax = HP;
    this.MP = MP;
    this.MPMax = MP;
    this.forca = forca;
    this.defesa = defesa;
    this.inventario = inventario;
  }

  abrirInventario(): void {
    this.inventario.listarItens();
  }

  usarItem(item: Item): void {
    if (item instanceof Pocao) {
      item.aplicarBeneficios(this);
      this.inventario.obterItem(this.inventario.itens.indexOf(item)).reduzirQuantidade(1);
    } else if (item instanceof Arma) {
      this.equiparArma(item);
    }
  }

  equiparArma(arma: Arma): void {
    if (this.arma) {
      this.arma.removerBeneficios(this);
    }
    this.arma = arma;
    this.arma.aplicarBeneficios(this);
  }

  desequiparArma(): void {
    if (this.arma) {
      this.arma.removerBeneficios(this);
      this.arma = null;
    }
  }

  imprimirInformacoes(): void {
    console.log(`Nome: ${this.nome}`);
    console.log(`HP: ${this.HP}`);
    console.log(`MP: ${this.MP}`);
    console.log(`Força: ${this.forca}`);
    console.log(`Defesa: ${this.defesa}`);
    console.log(`Arma: ${this.arma ? this.arma.nome : 'Nenhuma'}`);
  }
}

const menuItens = [
  new ItemMenu(1, "Equipar Arma"),
  new ItemMenu(2, "Tomar Poção"),
  new ItemMenu(3, "Adicionar Arma ao Inventário"),
  new ItemMenu(4, "Adicionar Poção ao Inventário"),
  new ItemMenu(5, "Imprimir Info"),
  new ItemMenu(6, "Desequipar Arma"),
  new ItemMenu(0, "Sair")
];

const menu = new Menu(menuItens);
const inventario = new Inventario(20);
const personagem = new Personagem("Herói", 100, 50, 20, 10, inventario);

let running = true;

while (running) {
  const opcao = menu.imprimirMenu();
  switch (opcao) {
    case 1:
      inventario.listarItens();
      const armaIndice = parseInt(prompt("Escolha a arma para equipar:") || "0", 10) - 1;
      if (armaIndice >= 0 && armaIndice < inventario.itens.length) {
        personagem.equiparArma(inventario.obterItem(armaIndice).getItem() as Arma);
      } else {
        console.log("Índice inválido");
      }
      break;
    case 2:
      inventario.listarItens();
      const pocaoIndice = parseInt(prompt("Escolha a poção para usar:") || "0", 10) - 1;
      if (pocaoIndice >= 0 && pocaoIndice < inventario.itens.length) {
        personagem.usarItem(inventario.obterItem(pocaoIndice).getItem() as Pocao);
      } else {
        console.log("Índice inválido");
      }
      break;
    case 3:
      const nomeArma = prompt("Nome da arma:");
      const descricaoArma = prompt("Descrição da arma:");
      const qtdArma = parseInt(prompt("Quantidade da arma:") || "1", 10);
      inventario.adicionarItem(new Arma(nomeArma!, descricaoArma!), qtdArma);
      break;
    case 4:
      const nomePocao = prompt("Nome da poção:");
      const descricaoPocao = prompt("Descrição da poção:");
      const qtdPocao = parseInt(prompt("Quantidade da poção:") || "1", 10);
      inventario.adicionarItem(new Pocao(nomePocao!, descricaoPocao!), qtdPocao);
      break;
    case 5:
      personagem.imprimirInformacoes();
      break;
    case 6:
      personagem.desequiparArma();
      break;
    case 0:
      running = false;
      break;
    default:
      console.log("Opção inválida. Tente novamente.");
  }
}
