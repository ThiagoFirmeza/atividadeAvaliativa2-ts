abstract class Item {
    protected nome: string;
    protected descricao: string;

    constructor(nome: string, descricao: string){
        this.nome = nome;
        this.descricao = descricao
    }

    abstract aplicarBeneficios(personagem: Personagem);
    abstract removerBeneficios(personagem: Personagem);
}

class Iteminventario {
    private quantidade: number;
    private item: string;

    constructor(quantidade: number, item: string){
        this.quantidade = quantidade;
        this.item = item;
    }
}

class Arma extends Item {
    constructor(nome: string, descricao: string) {
        super(nome, descricao)
    }

    aplicarBeneficios(personagem: Personagem){
        personagem.ataque += 10;
        personagem.defesa += 5;
    }
    removerBeneficios(personagem: Personagem){
        personagem.ataque -= 10;
        personagem.defesa -= 5;
    }

}

class Personagem {
    private nome: string;
    private hp: number;
    private mp: number;
    private ataque: number;
    private defesa: number;
    private inventario: string;
    private arma: string;

    constructor(nome: string, hp: number, mp: number, ataque: number, defesa: number, inventario: string, arma: string) {
        this.nome = nome;
        this.hp = hp;   
        this.mp = mp;
        this.ataque = ataque;
        this.defesa = defesa;
        this.inventario = inventario;
        this.arma = arma;
    }

    
    public getNome(): string {
        return this.nome;
    }

    public getHp(): number {
        return this.hp;
    }

    public getMp(): number {
        return this.mp;
    }

    public getAtaque(): number {
        return this.ataque;
    }

    public getDefesa(): number {
        return this.defesa;
    }

    public getInventario(): string {
        return this.inventario;
    }

    public getArma(): string {
        return this.arma;
    }

    // Métodos Set
    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setHp(hp: number): void {
        this.hp = hp;
    }

    public setMp(mp: number): void {
        this.mp = mp;
    }

    public setAtaque(ataque: number): void {
        this.ataque = ataque;
    }

    public setDefesa(defesa: number): void {
        this.defesa = defesa;
    }

    public setInventario(inventario: string): void {
        this.inventario = inventario;
    }

    public setArma(arma: string): void {
        this.arma = arma;
    }
    


}