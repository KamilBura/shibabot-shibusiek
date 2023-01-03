//Linia kodu this.build(); jest fragmentem kodu z konstruktora klasy ShibaBot. W skrócie, kod ten wywołuje metodę build obiektu ShibaBot.

//Metoda build jest metodą półpubliczną obiektu ShibaBot, co oznacza, że może być wywoływana wewnątrz tej samej klasy lub jej podklasach, 
//ale nie może być wywoływana bezpośrednio przez inne kody z zewnątrz tej klasy. 
//W konkretnym przypadku metoda build jest wywoływana po ustawieniu właściwości config obiektu ShibaBot na wartość zwracaną przez funkcję ImportConfig.

//Przykład:

class ShibaBot {
    constructor() {
      this.config = null;
    }
  
    build() {
      console.log('Building ShibaBot...');
    }
  }
  
  const bot = new ShibaBot();
  bot.build(); // Building ShibaBot..

//W powyższym przykładzie tworzymy nowy obiekt z klasy ShibaBot i wywołujemy metodę build tego obiektu. 
//W konsoli wyświetla się komunikat "Building ShibaBot...", co oznacza, że metoda build została pomyślnie wywołana.