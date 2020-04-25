CREATE TABLE card (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_class TEXT NOT NULL,
    card_style TEXT NOT NULL,
    card_text TEXT NOT NULL
);
INSERT INTO card (card_class, card_style, card_text) 
VALUES ('event', 'top: 50px; left: 100px;', 'Primeiro evento');