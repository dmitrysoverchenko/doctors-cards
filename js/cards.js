import { Element } from "./elements.js";
import { deleteCard } from "./API.js";
import { getCards } from "./API.js";

export class AllCards extends Element {
  constructor(cards) {
    super();
    this.cards = cards;
  }

  render() {
    const wrapperCards = document.querySelector(".wrapper-cards");
    if (this.cards.length == 0) {
      wrapperCards.innerHTML = "";
      this.noItems = this.createElement(
        "div",
        ["no-items"],
        "No items have been added..."
      );
      wrapperCards.append(this.noItems);
    } else {
      wrapperCards.innerHTML = "";
      this.cards.forEach((card) => {
        const renderCard = new Card(card);
        wrapperCards.append(renderCard.render());
      });
    }
    return wrapperCards;
  }
}

export class Card extends Element {
  constructor(cardInfo) {
    super();
    this.cardInfo = cardInfo;
  }

  deleteCard = () => {
    deleteCard(this.cardInfo.id).then((res) => {
      renderAllCards();
    });
  };

  renderHeaderCard = () => {
    this.header = this.createElement("div", ["card-header"]);
    this.iconDiv = this.createElement("div", ["icon-div"]);
    this.deleteIcon = this.createElement("i", ["bi", "bi-trash-fill"]);
    this.deleteIcon.addEventListener("click", this.deleteCard);
    this.editIcon = this.createElement("i", ["bi", "bi-pencil-square"]);
    this.editIcon.addEventListener("click", () => {
      this.editCard = new EditCard(this.cardInfo);
      this.editCard.render();
    });
    this.doctor = this.createElement(
      "p",
      ["card-text", "card-text-header"],
      this.cardInfo.doctor
    );
    this.fullName = this.createElement(
      "p",
      ["card-text"],
      this.cardInfo.fullName
    );
    const leadMoreButton = this.createElement(
      "p",
      ["card-btn-load"],
      "LOAD MORE"
    );
    leadMoreButton.addEventListener("click", () => {
      const body = document.querySelector(`.card-body-${this.cardInfo.id}`);
      body.style.display = "block";
      leadMoreButton.style.display = "none";
    });
    this.iconDiv.append(this.editIcon, this.deleteIcon);
    this.header.append(
      this.iconDiv,
      this.doctor,
      this.fullName,
      leadMoreButton
    );
    return this.header;
  };

  renderBody() {
    this.body = this.createElement("div", [`card-body-${this.cardInfo.id}`]);
    this.body.style.display = "none";
    const bodyElement = [];
    for (let key in this.cardInfo) {
      if (
        this.cardInfo[key] !== this.cardInfo.doctor &&
        this.cardInfo[key] !== this.cardInfo.fullName
      ) {
        let el = this.createElement("p", ["card-text"], this.cardInfo[key]);
        bodyElement.push(el);
      }
    }
    this.body.append(...bodyElement);
    return this.body;
  }

  render() {
    this.card = this.createElement("div", ["card", "w-25"]);
    this.card.append(this.renderHeaderCard(), this.renderBody());
    return this.card;
  }
}

export const renderAllCards = async (filterCards) => {
  let cards;
  if (filterCards) {
    cards = filterCards;
  } else {
    cards = await getCards();
  }
  const renderCards = new AllCards(cards);
  renderCards.render();
};
