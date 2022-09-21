# Network_hands
A project to display networks of hands in pictorial representations.
The first jupyter notebook collects pickles for hand classifications and corresponding iconographies of each painting from the collection. I then creates a network with a set of edges and nodes. With the library pyvis, an html page is then generated. Based on this html page, further javascript code is added for more functionalities.

The overall process:
- Get collection of hands
- Create 50 unsupervised clusters from keypoints features
- Link each hand to their corresponding cluster and to the painting it belongs
- Get iconography of the painting based on title and iconclass.org
- One painting = one iconography = a set of clusters working together narratively
- Nodes are clusters
- Edges are their corresponding iconography under which hands are grouped to express something visually
