
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { Keyboard } from '@sobol/ui/config/constants';
// import _ from 'lodash';
import { useSelector } from 'react-redux';
// import {
//   isFocusedObjectLoading as isFocusedObjectLoadingSelector,
// } from '@sobol/ui/objects/common/circles/store/selectors';
// import { isResizing as isResizingSelector } from '@sobol/ui/layouts/split/store/selectors';
import { useFid } from '@farcaster/rings-next/provider/FidProvider';
import * as d3 from 'd3';
import _ from 'lodash';
import { string } from 'zod';
import { graphSelector } from '@farcaster/rings-next/state/common-selectors';
import { useCommonActions } from '@farcaster/rings-next/hooks/useCommonActions';
import "./test.css";
import { H5 } from 'tamagui';
// /**
//  * Computes the number of truthy filter items.
//  * @param filter
//  * @returns {number}
//  */
// const filterLength = filter => Object.values(filter).filter(f => f).length;


const nodeRadius = 25;
const labelFontSize = 10;
const relationshipLabelFontSize = 8;
const clickToExpand = false;

  const measurementCanvas = () => {
    if (!measurementCanvas.canvas) {
      measurementCanvas.canvas = document.createElement('canvas');
    }
    return measurementCanvas.canvas;
  };
  
  const measureText = font => (text) => {
    const context = measurementCanvas().getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };
  
  const nodeLabelFont = `${labelFontSize}px`;
  const linkLabelFont = `${relationshipLabelFontSize}px`;
//   // Calculate this in advance
  const labelSpaceWidth = 10; // measureText(nodeLabelFont)(' ');
  const labelEllipsesWidth = 20; // measureText(nodeLabelFont)('...');
  
//   const viewNode = (object) => {
//     const objectType = object._type;
//     const objectId = object._id;
//     if (objectType === Types.User) {
//       history.push(objectUrl({ objectId, objectType }, null, { node: objectId }));
//     } else if (objectType === Types.Role) {
//       history.push(objectUrl({ _id: objectId, _type: Types.Role }, null, { node: objectId }));
//     } else if (objectType === Types.Team) {
//       history.push(objectUrl({ objectId, objectType }, null, { node: objectId }));
//     } else if (objectType === Types.Goal) {
//       history.push(objectUrl({ _id: objectId, _type: Types.Goal }, null, { node: objectId }));
//     } else if (objectType === Types.Agreement) {
//       history.push(objectUrl({ _id: objectId, _type: Types.Agreement }, null, { node: objectId }));
//     }
//   };
  
const createLinkId = (parent, child) => `link-${parent}-${child}`;
  
const nodeEntryRadiusTransition = targetRadius => node => node
  .transition()
  .duration(500)
  .attr('r', targetRadius);

// eslint-disable-next-line func-names
const handleFocusRing = focusedId => function (data) { // Needs to be a function for this binding
  const nodeGroup = d3.select(this);
  const isFocused = data.id === focusedId;
  nodeGroup.classed('focused', isFocused);
  let ring = nodeGroup.select('.interaction-ring');
  if (ring.empty()) {
    ring = nodeGroup
      .append('circle')
      .attr('r', 1)
      .classed('interaction-ring', true);
  }
  ring
    .classed('focused-ring', isFocused)
    .call(nodeEntryRadiusTransition(nodeRadius + (isFocused ? 3 : 1.5)));
};

// export const TypeColorMap = {
//     [Types.Team]: Colors.Cyan,
//     [Types.User]: Colors.Blue,
//     [Types.Role]: Colors.Yellow,
//     [Types.RoleAssignment]: Colors.Orange,
//     [Types.Agreement]: Colors.Magenta,
//     [Types.Goal]: Colors.Green,
//     [Types.CustomField]: Colors.Purple,
//     [Types.ObjectTemplate]: Colors.Red,
//     [Types.Application]: Colors.Geekblue,
//   };

const addCircle = (parent) => parent
  .append('circle')
  .attr('r', 1)
  .attr('fill', node => node.data.data ? `#FFD700` : '#008080')
  .attr('fill-opacity', node => (node.data._archivedOn ? 0.35 : 1))
  .attr('class', 'node-circle')
  .attr('node-id', n => n.id)
  .call(nodeEntryRadiusTransition(nodeRadius));

const nodeEnter = (dragNode, width, height, focusedId) => enter => enter
  .append('g')
    .attr('transform', n => `translate(${n.x || width() / 2}, ${n.y || height() / 2})`)
    .style('visibility', 'hidden')
    .each(handleFocusRing(focusedId))
    .call(parent => addCircle(parent))
    .call(dragNode(d3.drag()));

 const nodeUpdate = (focusedId) => update => update
  .each(handleFocusRing(focusedId))
  .call(group => group
    .select('.node-circle')
      .attr('fill', node => node.data.data ? `#FFD700` : '#008080')
      .attr('fill-opacity', node => (node.data._archivedOn ? 0.35 : 1)));

 const nodeExit = exit => exit
  .classed('removed', true)
  .call(node => node
    .transition()
    .duration(500)
    .remove()
    .select('.node-circle')
    .attr('r', 0));
//   const relationshipLengths = {
//     Role: '',
//     'Parent Team': '',
//     Goal: '',
//     Subgoal: '',
//     Signatory: '',
//     Party: '',
//     Assignment: '',
//     Assignee: '',
//   };
  
//   // Measure each of the relationship labels in advance to make sure links are long enough
//   Object.keys(relationshipLengths).forEach((name) => {
//     relationshipLengths[name] = measureText(linkLabelFont)(name);
//   });
  
//   const getRelationshipName = (parent, child) => ({
//     [Types.Role]: {
//       [Types.RoleAssignment]: 'Assignment',
//     },
//     [Types.RoleAssignment]: {
//       [Types.User]: 'Assignee',
//     },
//     [Types.Team]: {
//       [Types.Team]: 'Parent Team',
//       [Types.Role]: 'Role',
//       [Types.Goal]: 'Goal',
//       [Types.Agreement]: 'Owner',
//     },
//     [Types.User]: {
//       [Types.Goal]: 'Goal',
//       [Types.Agreement]: 'Signatory',
//     },
//     [Types.Goal]: {
//       [Types.Goal]: 'Subgoal',
//     },
//   })[parent._type][child._type];
  
  // This lets us decouple the node object from the underlying data object so we can swap it out
  const makeNodeObject = (id, data, nodesById, middle, parentNode) => {
    try {
      if (nodesById[id]) {
        return {
          ...nodesById[id],
          // Updating data for visible nodes
          data: data[id],
          // Mark whether or not the node was previously visible
          existed: true,
        };
      }
      const angle = Math.random() * 2 * Math.PI;
      const x = parentNode ? parentNode.x + (Math.cos(angle) * nodeRadius * 1.1) : middle.x;
      const y = parentNode ? parentNode.y + (Math.sin(angle) * nodeRadius * 1.1) : middle.y;
      return {
        id,
        x,
        y,
        existed: false,
        get data() {
          return data[id];
        },
      };
    } catch (e) {
      // wrapping this util in try/catch cuz it's too damn confusing debugging these errors
      // eslint-disable-next-line no-console
      console.error('makeNodeObject', e);
      throw e;
    }
  };
  
  // Mathemagical function to calculate how much horizontal space there is in a circle
  // at any height within the circle.
  const calculateChordLength = (offset, r) => Math.cos(Math.asin(offset / r)) * 2 * r;
  
  // Must be a function - D3 binds this for the function
  function buildLabel(node) {
    try {
      const label = d3.select(this)
        .append('text')
        .attr('class', 'node-label')
        .attr('dx', 0)
        .attr('dy', 0);
      // Added a default to avoid crashes if we ever display more node types without explicit names
      const { name = '<no name>' } = node.data;
      const length = measureText(nodeLabelFont);
      const offsetLineLength = calculateChordLength(labelFontSize * 1.1, nodeRadius) - 6;
      const mainLineLength = (nodeRadius * 2) - 4;
      const lineLengths = [offsetLineLength, mainLineLength, offsetLineLength];
      const labelLines = ['', '', ''];
      let currentLine = 0;
      let currentLineText = '';
      let currentLineLength = 0;
      name.split(' ').forEach((word) => {
        if (currentLine > 2) return;
        const wordLength = length(word);
        if (wordLength + currentLineLength /*+ labelSpaceWidth*/ > lineLengths[currentLine]) {
          // If the currently built line has content, then add it
          // Otherwise we have a long word that won't fit
          if (currentLineLength > 0) {
            // If on the last line, we need to add ellipses
            if (currentLine === 2) {
              while (currentLineLength /*+ labelEllipsesWidth*/ > lineLengths[currentLine]) {
                currentLineText = currentLineText.slice(0, -1);
                currentLineLength = length(currentLineText);
              }
              currentLineText += '...';
            }
            labelLines[currentLine] = currentLineText;
            currentLine += 1;
            currentLineText = '';
            currentLineLength = 0;
            if (currentLine > 2) return;
            // If we are on the first line, try the main line
          } else if (currentLine === 0 && wordLength <= lineLengths[1]) {
            // Just increment the line and let things go on as usual
            currentLine += 1;
            // Otherwise try to place it using ellipses
          } else {
            currentLineText = word.slice(0, -1);
            currentLineLength = length(currentLineText);
            while (currentLineLength + labelEllipsesWidth > lineLengths[currentLine]) {
              currentLineText = currentLineText.slice(0, -1);
              currentLineLength = length(currentLineText);
            }
            currentLineText += '...';
            labelLines[currentLine] = currentLineText;
            currentLineText = '';
            currentLineLength = 0;
            currentLine += 1;
            return;
          }
        }
        if (currentLineLength > 0) {
          currentLineText += ' ';
          currentLineLength += labelSpaceWidth;
        }
        currentLineText += word;
        currentLineLength += wordLength;
      });
  
      if (currentLineText) {
        labelLines[currentLine] = currentLineText;
      }
  
      // Shift first line up if we have 3
      const lineNumberOffset = labelLines[2] || !labelLines[0] ? 1 : 0;
  
      labelLines.forEach((line, i) => line && label
        .append('tspan')
        .text(line)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', `${1.1 * (i - lineNumberOffset)}em`));
    } catch (e) {
      // wrapping this util in try/catch cuz it's too damn confusing debugging these errors
      // eslint-disable-next-line no-console
      console.error('buildLabel', e);
      throw e;
    }
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const NodeExplorer = ({
      mountId,
      data,
      focusedNodeId,
      switchFocus,
      setLabel,
    }: {
        mountId: string,
        data: any,
        focusedNodeId: string,
        switchFocus: any,
        setLabel: any,
    }) => {
    // Actually private variables
    const expanded = {};
    let width;
    let height;
  
    let nodes;
    let nodesById = {};
    let links;

    const { fid, setFid } = useFid();

    const [simulation, setSimulation] = useState(null);
    // // SVG related variables
        
    const [focusedNode, setFocusedNode] = useState(focusedNodeId);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
    const [svg, setSvg] = useState(null);
    const [zoomGroup, setZoomGroup] = useState(null);
    const [nodeGroup, setNodeGroup] = useState(null);
    const [linkGroup, setLinkGroup] = useState(null);
    const [labelGroup, setLabelGroup] = useState(null);

    const [isInit, setIsInit] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const node = document.getElementById(mountId);
            setMountNode(node);
        }
    }, [window]);
  
    const getWidth = () => mountNode.clientWidth;
    const getHeight = () => 800;


    const dragNode = (simulation) => (drag) => drag
      .on('start', (event, node) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        node.fx = node.x;
        node.fy = node.y;
      })
      .on('drag', (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on('end', (event, node) => {
        if (!event.active) simulation.alphaTarget(0).restart();
        if (node.id === focusedNode) return;
        // Must be undefined - null causes D3 to kill the x and y coordinates (isNaN(null) === true)
        node.fx = undefined;
        node.fy = undefined;
      });
  
    return {
      isInit,    
      checkIfReady () {
        return !!mountNode;
      },
      init() {
        this._updateNodes(data, focusedNode);
        setIsInit(true);
      },
      focusNode(newId) {
        setFocusedNode(newId)
        this._updateNodes(data, newId);
      },
      updateData(newData, focusedNodeId) {
        setFocusedNode(focusedNodeId)
        data = newData;
        this._updateNodes(data, focusedNodeId);
      },
      _updateNodes(graphNodes, focusedNodeId) {
        links = [];
        // Keep track of visited nodes to prevent re-traversing the graph
        const visitedNodes = {};
        // Keep track of which nodes have been linked to prevent duplicate links
        const linkedNodes = {};
        const expandNodes = (nodeId, layersRemaining, parentNode) => {
          const node = graphNodes[nodeId];
          if (!node) {
            // Happens when we encounter an unloaded node
            return [];
          }
          if (visitedNodes[nodeId]) return [];
          const nodeObject = makeNodeObject(nodeId, data, nodesById || {}, {
            x: getWidth() / 2, y: getHeight() / 2,
          }, parentNode);
          if (nodeId === focusedNodeId) {
            nodeObject.fx = getWidth() / 2;
            nodeObject.fy = getHeight() / 2;
          } else {
            nodeObject.fx = undefined;
            nodeObject.fy = undefined;
          }
          if (((clickToExpand && !expanded[nodeId]) || layersRemaining <= 0) &&
            node._id !== focusedNodeId) {
            visitedNodes[nodeId] = true;
            return [nodeObject];
          }
          const linkDistance = 120 //+ Math
           // .min(((node.children?.length + node.parents.length) * 10), 100);
          node.children.forEach((child) => {
            const linkId = createLinkId(nodeId, child.key);
            if (linkedNodes[linkId] || !graphNodes[child.key]) return;
            linkedNodes[linkId] = true;
            const name = child.name;
            links.push({
              source: nodeId,
              target: child.key,
              id: linkId,
              strength: 0.7,
              // TODO: trying to safeguard against a falsy lookup resulting in NaN math
              distance: linkDistance, // + (relationshipLengths[name] || 0),
              name,
            });
          });
          node.parents.forEach((parent) => {
            const linkId = createLinkId(parent.key, nodeId);
            if (!graphNodes[parent.key]) return;
            if (linkedNodes[linkId]) return;
            linkedNodes[linkId] = true;
            graphNodes[parent.key]._expandedFrom = nodeId;
            const name = parent.name;
            links.push({
              source: parent.key,
              target: nodeId,
              id: linkId,
              strength: 0.7,
              // TODO: trying to safeguard against a falsy lookup resulting in NaN math
              distance: linkDistance, // + (relationshipLengths[name] || 0),
              name,
            });
          });
          visitedNodes[nodeId] = true;
          return _.flattenDeep([
            nodeObject,
            ...node.children.map(child => expandNodes(child.key, layersRemaining - 1, nodeObject)),
            ...node.parents.map(parent => expandNodes(parent.key, layersRemaining - 1, nodeObject)),
          ]);
        };
        nodes = expandNodes(focusedNodeId, 2, null);
        nodesById = _.keyBy(nodes, 'id');
        this.render(focusedNodeId);
      },
      render: (focusedNodeId) => {
        let currNodeGroup = nodeGroup;
        let currLinkGroup = linkGroup;
        let currLabelGroup = labelGroup;
        let currSimulation = simulation;
        if (!svg) {
          width = mountNode.clientWidth;
          height = 800;
          let transform = { x: 0, y: 0, k: 1 };
          const newSvg = d3.select(`#${mountId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'node-explorer-svg');
          const newZoomGroup = newSvg
            .append('g');
          let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .on('zoom', (event) => {
              ({ transform } = event);
              newZoomGroup.attr('transform', transform);
            });
          newSvg.call(zoom)
            .on('dblclick.zoom', null);
          
  
          const defs = newSvg
            .append('defs');
          defs
            .append('marker')
            .attr('id', 'link-arrowhead')
            .classed('arrowhead', true)
            .attr('orient', 'auto-start-reverse')
            .attr('viewBox', '0 -5 10 10')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5');
  
          window.addEventListener('resize', () => {
            newSvg
              .attr('width', getWidth())
              .attr('height', getHeight());
          });
  
          currLinkGroup = newZoomGroup
            .append('g')
            .attr('name', 'Links');
          currNodeGroup = newZoomGroup
            .append('g')
            .attr('name', 'Nodes');
          currLabelGroup = newZoomGroup
            .append('g')
            .attr('name', 'Labels');
  
          currSimulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-80))
            .force('link', d3.forceLink(links)
              .id(link => link.id)
              .strength(link => link.strength)
              .distance(link => link.distance))
            .force('collide', d3.forceCollide(nodeRadius).strength(1).iterations(50));
            setSvg(newSvg);
            setZoomGroup(newZoomGroup);
            setLinkGroup(currLinkGroup);
            setNodeGroup(currNodeGroup);
            setLabelGroup(currLabelGroup);
        }
  
        const renderedNodes = currNodeGroup
          .selectAll('g')
          .data(nodes, node => node.id)
          .join(
            nodeEnter(dragNode(currSimulation), getWidth, getHeight, focusedNodeId),
            nodeUpdate(focusedNodeId),
            nodeExit,
          );

  
        renderedNodes
          .filter('.removed')
          .classed('removed', false)
          .transition()
            .duration(500)
            .select('.node-circle')
            .attr('r', nodeRadius);

  
        const renderedLinks = currLinkGroup
          .selectAll('g')
          .data(links, link => link.id)
          .join(enter => enter
            .append('g')
            .call(group => group
              .append('line')
              .classed('node-link', true)
              .attr('marker-start', 'url(#link-arrowhead)'))
            .call(group => group
              .append('text')
              .classed('link-label-text', true)
              .text(link => link.name)));

  
        const renderedLabels = currLabelGroup
          .selectAll('g')
          .data(nodes, node => node.id)
          .join(
            enter => enter
              .append('g')
              .attr('transform', 'translate(0, 0)')
              .each(buildLabel));
        renderedNodes.on('click', (event, clickedNode) => {
            if (!clickedNode.data?.data?.objectAddBody && clickedNode.data.fid && clickedNode.data.fid !== focusedNodeId) {
                expanded[clickedNode.data.fid] = true;
                setFid(clickedNode.data.fid)
                switchFocus(clickedNode.data.fid);
                setLabel('');
            } else if (clickedNode.data?.data?.objectAddBody) {
                let string = 'Stones: ';
                clickedNode.data.stones.forEach((stone) => {string = `${string} ${stone.data.tagBody.content}`})
                setLabel(string);
            }
        });
        currSimulation
          .on('tick', () => {
            renderedNodes
              .attr('transform', n => `translate(${n.x}, ${n.y})`)
              .style('visibility', null); // Make visible
            renderedLabels
              .attr('transform', n => `translate(${n.x}, ${n.y})`);
            renderedLinks
            // eslint-disable-next-line prefer-arrow-callback,func-names
              .each(function (link) {
                const groupObj = d3.select(this);
                const linkObj = groupObj.select('line');
                const labelObj = groupObj.select('text');
                const dx = link.source.x - link.target.x;
                const dy = link.source.y - link.target.y;
                const angle = Math.atan2(dy, dx);
                linkObj
                  .attr('x1', l => l.source.x - (Math.cos(angle) * (nodeRadius + 3)))
                  .attr('y1', l => l.source.y - (Math.sin(angle) * (nodeRadius + 3)))
                  .attr('x2', l => l.target.x)
                  .attr('y2', l => l.target.y);
                const labelX = link.target.x + (dx / 2);
                const labelY = link.target.y + (dy / 2);
                let textAngle = (angle * 180 / Math.PI); // Convert from radians
                // Keep the text from going upside down
                if (textAngle < -90 || textAngle > 90) textAngle += 180;
                labelObj
                  .attr('x', labelX)
                  .attr('y', labelY)
                  .attr('transform', `rotate(${textAngle} ${labelX} ${labelY})`);
              });
          });
        currSimulation.nodes(nodes);
        currSimulation.force('link').links(links)
          .id(link => link.id);
        currSimulation.alpha(1).restart();
        setSimulation(currSimulation);

      },
    };
  };


// adds a functional layer to inject hooks
const NodeExplorerWrapper = ({ children } : { children: any}) => {
//   const isFocusedObjectLoading = useSelector(isFocusedObjectLoadingSelector);
//   const isResizing = useSelector(isResizingSelector);
    const { fid } = useFid();
    // const [graphNodes, setGraphNodes] = useState({
    //     "773349": { fid: '773349'},
    //     "FARCASTER_NETWORK_DEVNET_798902_0xa34b0ffe59ddd56790ee7557c069438c40106198": {
    //         data: {
    //             objectAddBody: {
    //                 displayName: "Ring of Trust",
    //             }
    //         }
    //     }
    // });
    const [label, setLabel] = useState("");
    const [focusedNodeId, setFocusedNodeId] = useState(String(fid));
    const { fetchUserRings } = useCommonActions();

    const switchFocus = (newId: number) => {
        setFocusedNodeId(newId.toString());
        // fetchUserRings(newId);
    }

    const graphNodes = useSelector(graphSelector);

    const _nodeExplorer = NodeExplorer({
        mountId: 'node-explorer-root',
        data: graphNodes,
        focusedNodeId,
        switchFocus,
        setLabel,
        // degrees,
        // filter,
        // theme,
    });

    useEffect(() => {
        setFocusedNodeId(String(fid));
    }, [fid]);

    // const loadAdjacencies = (props) => {
    //     const { currentUser, focusedId, degrees, loadAdjacencies, filter } = props;
    //     const id = focusedId || currentUser?._id;
    //     const node = props.graphNodes[id];
    //     if (!id || !node) return;
    //     loadAdjacencies({
    //       objectId: id,
    //       objectType: node._type,
    //       objectTypes: Object.keys(filter).filter(type => filter[type]),
    //       degrees,
    //     });
    //   };

    useEffect(() => {
        if (_nodeExplorer.checkIfReady()) {
            if (_nodeExplorer.isInit) {
                _nodeExplorer.updateData(graphNodes, focusedNodeId);
            } else {
                _nodeExplorer.init();
            }
        }
    }, [_nodeExplorer.checkIfReady(), graphNodes, focusedNodeId])

    // useEffect(() => {
    //     _nodeExplorer.updateData(graphNodes);
    //     // if (this.props.degrees !== nextProps.degrees) {
    //     //     this._nodeExplorer.updateDegrees(nextProps.degrees);
    //     // }
    //     // if (!_.isEqual(this.props.filter, nextProps.filter)) {
    //     //     // If the criteria has been expanded to include a new type, load adjacencies
    //     //     // because there could be new items.
    //     //     if (filterLength(this.props.filter) < filterLength(nextProps.filter)) {
    //     //         this.loadAdjacencies(nextProps);
    //     //     }
    //     //     this._nodeExplorer.updateFilter(nextProps.filter);
    //     // }
    //     // if (this.props.theme !== nextProps.theme) {
    //     //     this._nodeExplorer.updateTheme(nextProps.theme);
    //     // }
    //     // if (this.props.isFocusedObjectLoading && !nextProps.isFocusedObjectLoading) {
    //     //     this._nodeExplorer.handleResize();
    //     // }
    //     // if (this.props.isResizing && !nextProps.isResizing) {
    //     //     this._nodeExplorer.handleResize();
    //     // }
    // }, [graphNodes]); 

    // useEffect(() => {
    //     let { focusedId } = nextProps;
    //     if (!focusedId) {
    //         focusedId = nextProps.currentUser?._id;
    //     }
    //     this._nodeExplorer.focusNode(focusedId);
    //     this.loadAdjacencies(nextProps);
    // }, [focusedId]);

    return (
        // Tab index needs to be set in order to use the key down handler
        <>
            <div id="node-explorer-root">
                {children}
                <H5>{label}</H5>

            </div>
        </>
    );
};

export default NodeExplorerWrapper;
