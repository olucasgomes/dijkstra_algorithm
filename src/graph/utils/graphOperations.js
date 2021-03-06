export const depthFirstSearch = (graph, vertex, discovered) => {
  const incidentEdges = graph.incidentEdges(vertex)
  incidentEdges.forEach((e) => {
    const opposite = e.opposite(vertex)
    if (!discovered.has(opposite)) {
      discovered.set(opposite, e)
      depthFirstSearch(graph, opposite, discovered)
    }
  })
}

export const depthFirstSearchComplete = (graph) => {
  const forest = new Map()
  for (const v of graph.vertices) {
    if (!forest.has(v)) {
      forest.set(v, null)
      depthFirstSearch(graph, v, forest)
    }
  }
  return forest
}

export const breadthFirstSearch = (graph, vertex, discovered) => {
  const queue = [vertex]
  while (queue.length > 0) {
    const currentVertex = queue.shift()

    graph.incidentEdges(currentVertex).forEach((edge) => {
      const opposite = edge.opposite(currentVertex)

      if (!discovered.has(opposite)) {
        discovered.set(opposite, edge)
        queue.push(opposite)
      }
    })
  }
}

export const constructPath = (origin, destination, discovered) => {
  const path = []
  if (discovered.has(destination)) {
    let step = destination

    path.push(destination)

    while (step !== origin) {
      const edge = discovered.get(step)
      const opposite = edge.opposite(step)
      path.unshift(opposite)
      step = opposite
    }
  }
  return path
}

export const toStringMap = (map) => {
  map.forEach((key, value, index) => {
    console.log({ key, value, index })
  })
}

// Dijkstra
const setupDijkstra = (graph) => {
  const map = new Map()
  for (const v of graph.vertices) {
    map.set(v, {
      predecessor: null,
      estimate: Number.POSITIVE_INFINITY,
      isOpen: true,
    })
  }
  return map
}

const hasOpenVertices = (vertices) => {
  let hasOpenVertices = false
  vertices.forEach((vertexProps, vertex) => {
    if (vertexProps.isOpen) {
      hasOpenVertices = true
    }
  })
  return hasOpenVertices
}

const getOpenVertices = (vertices) => {
  const openVertices = new Map()
  vertices.forEach((vertexProps, vertex) => {
    if (vertexProps.isOpen) {
      openVertices.set(vertex, vertexProps)
    }
  })
  return openVertices
}

const getSmallerEstimateVertex = (vertices) => {
  let smallerEstimate = Number.POSITIVE_INFINITY
  let smallerVertex
  vertices.forEach((vertexProps, vertex) => {
    if (vertexProps.estimate < smallerEstimate) {
      smallerVertex = vertex
      smallerEstimate = vertexProps.estimate
    }
  })
  return smallerVertex
}

const relaxEdge = (edge, vertices) => {
  const { _origin, _destination } = edge

  const vertexProps = vertices.get(_destination)
  const predecessorProps = vertices.get(_origin)

  const sum = predecessorProps.estimate + edge.element

  if (sum < vertexProps.estimate) {
    vertexProps.predecessor = _origin
    vertexProps.estimate = sum
  }
}

export const initDijkstra = (graph, initialVertex) => {
  const vertices = setupDijkstra(graph)

  vertices.get(initialVertex).estimate = 0

  while (hasOpenVertices(vertices)) {
    const openVertices = getOpenVertices(vertices)

    const smallerEstimateVertex = getSmallerEstimateVertex(openVertices)
    vertices.get(smallerEstimateVertex).isOpen = false

    const outcoming = graph.incidentEdges(smallerEstimateVertex)

    outcoming.forEach((edge) => {
      relaxEdge(edge, vertices)
    })
  }
  return vertices
}

export const dijkstraShortestPaths = (vertices, origin, destination) => {
  const destinationVertex = vertices.get(destination)
  let auxVertex = Object.assign(destinationVertex, {})
  const path = []

  while (auxVertex.predecessor !== origin) {
    path.unshift(auxVertex.predecessor)
    auxVertex = vertices.get(auxVertex.predecessor)
  }

  path.unshift(origin)
  path.push(destination)

  return path.join(' -> ')
}
