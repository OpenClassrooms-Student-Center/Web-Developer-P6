
# HOT TAKES Backend #
## Installation ##
Clonez ce repo, et faire run `npm install` depuis le répertoire du projet.

## Utilisation de l'application ##
Exécutez `npm start` depuis le répertoire frontend du projet.

Exécutez `npx nodemon` depuis le répertoire backend du projet

Le projet utilise :

`NODE.JS` et les packages `EXPRESS JS` et `nodemon`.
Et la base de données : `MONGODB`.



## API Reference

#### Get all sauces

```http
  GET /api/sauces
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `/` | `string` | Retourne toutes les sauces avec uniquement leur identifiant, noms, images et chaleurs|

#### Get one sauce

```http
  GET /api/sauces/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/:id`      | `string` | renvoie toutes les informations sur une sauce spécifique :  nom, image, marque, description, like ou dislike |

#### Post One sauce

Create sauce 
```http
    POST /api/sauces

```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/` | `string` |  Crée une nouvelle sauce                |

#### PUT One sauce
Modify sauce 
```http
    PUT /api/sauces/:id

```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/:id`  | `string` | Met à jour une sauce spécifique,disponible que pour le créateur de la sauce.                    |

#### DELETE One sauce
Delete sauce 
```http
    DELETE /api/sauces/:id

```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/:id` | `string` | Supprime une sauce spécifique, disponible que pour le créateur de la sauce.                    |

#### POST like or dislike sauce
Like sauce 
```http
    POST /api/sauces/:id/like

```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/:id/like` | `string` | Permet à l'utilisateur de liker (aimer) ou disliké (ne pas aimé) une sauce spécifique                     |


## Authors

- [@VanGitParis](https://www.github.com/VanGitParis)

