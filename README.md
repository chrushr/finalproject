# finalproject

/* ==============================================
Final Project - Tianyi Ren

This web mapping tool proposes suitable sites for a new store of Whole Foods Supermarket in San Francisco,
considering the store’s features, the various factors affecting the store’s success, and the potential
customer population for both the store itself and the competitor stores.

==================================================
(User Manual) The tool has the following features:

1. Show/Hide Stores (markers)
  a. Click on "Next" & "Previous" button to see each of the Whole Foods stores
  b. Click on "Show All" to see all stores, and clicke on "Clear All" to remove all stores

2. Siting new store
  a. Rank the four factors based on their importance levels, and select a store size range,
     then click "Add New Store", a new marker will be added to the map
  b. Change ranking and other inputs to add new locations on the map (removing the current one)
  c. Click "Remove New Store" to remove the new store

3. View Customer Distribution
  a. When no new stores on the map: hovering on an existing supermarket marker (yellow) will create
     a map of the current customer population of this store. The user can see the specific values
     by hovering on the census tracts.
  b. When a new store is added: hovering on the existing store marker (yellow) will create a map
     of the changes in the customer population of this store. The user can see the specific values
     by hovering on the census tracts.
  c. When a new store is added: clicking on the existing store marker (yellow) will create a map
     of the percentage (of the total population shopping at all 7 stores (6 existing + 1 new))
     change of the customers at this store. The user can see the specific values by hovering on
     the census tracts.
  d. When a new store is added: hovering on the new store marker (red) will create a map of the
     changes in customer population (from 0 to current value) of the new store. The user can see
     the specific values by hovering on the census tracts.
  e. When a new store is added: clicking on the new store marker (red) will create a map of the
     customer population of the new store as a percentage of the total population shopping at all
     7 stores (6 existing + 1 new). The user can see the specific values by hovering on the census
     tracts.
