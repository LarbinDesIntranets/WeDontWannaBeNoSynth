# DataStructure reflexion

## Version initiale

- Liste d'"instrument"(Array)
  - Chaque "instrument" à N nombre de "piste"(Array[instument.longeur])
    - chaque "piste" est de longeur définie, contient les temps ou la piste doit être activée(Set)
### Utilisation
Lors d'un clic on ajoute/supprime la cellule dans le Set approprié.

Lors de la lecture on boucle sur tous les instruments, puis sur chaque piste des instruments. On check si le tempo actuel est coché. Si oui on joue un son sinon on ne fait rien.

### Problèmes/limites
- Pas de son de longue durée
- Pas possible de décalé d'un demi-temps/décalé en dehors des beats

## Reflexion sur une nouvelle structure

### Optimisation/Précision

Calculer à chaque début de séquence/piste les sons à venir afin de tous les planifier d'un coup

### Spécificité de la donnée la plus fine

Une zone active aura pour effet de trigger la génération de l'onde avec les spécificités de l'instrument selectionné.(feature suivante)

Chaque zone appartient à une piste d'un insstrument.

Cette zone est caractérisée au sein de la piste par :
- un timing de démmarrage
- une durée

#### Gestion de l'ajout/suppression d'une zone => create/delete
Suggestions :
- un clic gauche sur une zone vide => Création
- Un clic gauche sur une zone existante => Update
- un clic droit sur une zone existante => Suppression
- un clic droit sur une zone inexistante => ?Prolongation automatique de la zone active jusque là ?

#### Définition de la durée de la note => modification

Ouverture d'une zone avec 2 champs de formulaire pour éditer.

Alternative : mieux gérer l evenement dun cllic pour mermettre la modification par des clics

## Impact sur l'affichage

Utilisation de plusieurs canvas pour faire des couches :

- 1 pour la grille avec les zone de l'instrument selectionné
- 1 pour l'affichage d'une barre de progression lors de la lecture

## Impact sur la génération auditive

Pour chaque instrument, à chaque début de piste on planifie les oscilliation de la séquence à venir d'un coup.

Amélioration de la synchro entre note

Perte de réactivité en cas de changement à chaud(quoique, il y a peut être moyen de faire jouette avec l'oscillateur si on a la référence, on devrait pouvoir supprimer pour rajouter la nouvelle info)

## DataStructure

Après avoir envisagé 3 approches :
1. [[0,1],[3,4],[4,4.5]]
2. [0,1,3,4,4,4.5]
3. [0,1,2,1,0,0.5]

Pour chaque proposition on stocke le même nombre de chiffre.

Le troisième est plus confus, on y indique le temps avant le prochain changement actif/inactif.

Pour les 2 premiers les nombres sont exactement les mêmes, la première me semble donc être la plus appropriée. Elle semble également être plus adaptée à de futures modifications qui devraient être faites sur la structure même.