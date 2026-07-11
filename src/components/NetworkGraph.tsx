/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Network, Activity, Disc, RefreshCw, ZoomIn, ZoomOut, Compass, Info, Search, FileText, ShieldAlert } from 'lucide-react';
import { FIR, Person, Relationship, Location, FinancialTransaction } from '../types';

interface Node {
  id: string;
  label: string;
  type: 'accused' | 'victim' | 'location' | 'financial';
  val: number; // size
  x: number; // 3D x
  y: number; // 3D y
  z: number; // 3D z
  vx: number;
  vy: number;
  vz: number;
  cluster: number;
  originalData: any;
}

interface Link {
  source: string;
  target: string;
  type: string;
  linkedFirs: string[];
}

interface NetworkGraphProps {
  firs: FIR[];
  persons: Person[];
  relationships: Relationship[];
  locations: Location[];
  transactions: FinancialTransaction[];
  onSelectEntity: (id: string, type: 'person' | 'fir') => void;
  selectedEntityId?: string;
  displayTheme?: 'obsidian' | 'polaris';
}

export default function NetworkGraph({
  firs,
  persons,
  relationships,
  locations,
  transactions,
  onSelectEntity,
  selectedEntityId,
  displayTheme = 'obsidian'
}: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Graph state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isRotating, setIsRotating] = useState(true);
  const [showClusters, setShowClusters] = useState(false);
  const [zoom, setZoom] = useState(1.1);
  const [tilt, setTilt] = useState(0.4); // X rotation
  const [pan, setPan] = useState(0.2); // Y rotation

  // Physics simulation settings
  const springLength = 140;
  const kSpring = 0.05;
  const repulsion = 800;
  const friction = 0.85;

  // Track active dragging
  const dragNodeRef = useRef<Node | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Initialize nodes and links
  useEffect(() => {
    // Collect unique nodes from relations, transactions, and FIRs
    const nodeMap = new Map<string, Node>();
    const linkList: Link[] = [];

    // Filter relevant nodes to keep graph responsive
    const activeAccused = persons.filter(p => p.role === 'accused').slice(0, 45);
    const activeVictims = persons.filter(p => p.role === 'victim').slice(0, 30);
    const activeLocations = locations.slice(0, 25);
    const activeTransactions = transactions.slice(0, 40);

    // 1. Add Accused Nodes
    activeAccused.forEach((p, idx) => {
      // Deterministic initial 3D spherical layout
      const phi = Math.acos(-1 + (2 * idx) / activeAccused.length);
      const theta = Math.sqrt(activeAccused.length * Math.PI) * phi;
      const r = 250;

      nodeMap.set(p.id, {
        id: p.id,
        label: p.name,
        type: 'accused',
        val: p.id.includes('SERIAL') ? 22 : 12,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: 0, vy: 0, vz: 0,
        cluster: p.id.includes('SERIAL-01') ? 1 : (p.id.includes('SERIAL-02') ? 2 : 0),
        originalData: p
      });
    });

    // 2. Add Victim Nodes
    activeVictims.forEach((p, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / activeVictims.length);
      const theta = Math.sqrt(activeVictims.length * Math.PI) * phi;
      const r = 320;

      nodeMap.set(p.id, {
        id: p.id,
        label: p.name,
        type: 'victim',
        val: 10,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: 0, vy: 0, vz: 0,
        cluster: 0,
        originalData: p
      });
    });

    // 3. Add Location Nodes
    activeLocations.forEach((l, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / activeLocations.length);
      const theta = Math.sqrt(activeLocations.length * Math.PI) * phi;
      const r = 280;

      nodeMap.set(l.id, {
        id: l.id,
        label: l.name,
        type: 'location',
        val: 14,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: 0, vy: 0, vz: 0,
        cluster: l.name.includes('Majestic') ? 1 : (l.name.includes('Gokulam') ? 2 : 3),
        originalData: l
      });
    });

    // 4. Add Financial Accounts
    activeTransactions.forEach((t) => {
      if (!nodeMap.has(t.from_account)) {
        nodeMap.set(t.from_account, {
          id: t.from_account,
          label: `Acc: ${t.from_account.substring(3)}`,
          type: 'financial',
          val: t.flagged ? 11 : 8,
          x: rngRange(-200, 200), y: rngRange(-200, 200), z: rngRange(-200, 200),
          vx: 0, vy: 0, vz: 0,
          cluster: t.flagged ? 4 : 0,
          originalData: t
        });
      }
      if (!nodeMap.has(t.to_account)) {
        nodeMap.set(t.to_account, {
          id: t.to_account,
          label: `Acc: ${t.to_account.substring(3)}`,
          type: 'financial',
          val: t.flagged ? 11 : 8,
          x: rngRange(-200, 200), y: rngRange(-200, 200), z: rngRange(-200, 200),
          vx: 0, vy: 0, vz: 0,
          cluster: t.flagged ? 4 : 0,
          originalData: t
        });
      }

      linkList.push({
        source: t.from_account,
        target: t.to_account,
        type: t.flagged ? 'flagged_tx' : 'tx',
        linkedFirs: [t.linked_fir_id]
      });
    });

    // Helpers to random range
    function rngRange(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    // 5. Build relationships link lists
    relationships.forEach((r) => {
      // Only build links if both nodes exist in active map
      if (nodeMap.has(r.person_id_1) && nodeMap.has(r.person_id_2)) {
        linkList.push({
          source: r.person_id_1,
          target: r.person_id_2,
          type: r.type,
          linkedFirs: r.linked_fir_ids
        });

        // Set serial cluster propagation
        if (r.person_id_1 === 'PER-SERIAL-01' || r.person_id_2 === 'PER-SERIAL-01') {
          nodeMap.get(r.person_id_1)!.cluster = 1;
          nodeMap.get(r.person_id_2)!.cluster = 1;
        } else if (r.person_id_1 === 'PER-SERIAL-02' || r.person_id_2 === 'PER-SERIAL-02') {
          nodeMap.get(r.person_id_1)!.cluster = 2;
          nodeMap.get(r.person_id_2)!.cluster = 2;
        }
      }
    });

    // 6. Connect locations with associated FIRs / accused
    firs.slice(0, 60).forEach((f) => {
      // Find location node
      const locNode = locations.find(l => l.name === f.station || l.district === f.district);
      if (locNode && nodeMap.has(locNode.id)) {
        // Find if any accused matches narrative
        persons.filter(p => p.role === 'accused').forEach((acc) => {
          if (nodeMap.has(acc.id) && (f.mo_description.includes(acc.name) || f.narrative_text.includes(acc.name))) {
            linkList.push({
              source: acc.id,
              target: locNode.id,
              type: 'incident_loc',
              linkedFirs: [f.id]
            });
          }
        });
      }
    });

    setNodes(Array.from(nodeMap.values()));
    setLinks(linkList);
  }, [firs, persons, relationships, locations, transactions]);

  // Main canvas render and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleY = 0; // for orbit rotation

    // Match parent size
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || 800;
      canvas.height = rect?.height || 500;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderLoop = () => {
      // 1. Physics Step: Repulsion & Spring forces
      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (n1 === dragNodeRef.current) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dz = n2.z - n1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

          if (dist < 400) {
            // Repulsion formula
            const force = repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            const fz = (dz / dist) * force;

            n1.vx -= fx;
            n1.vy -= fy;
            n1.vz -= fz;

            n2.vx += fx;
            n2.vy += fy;
            n2.vz += fz;
          }
        }

        // Gravity/Pull to center
        n1.vx -= n1.x * 0.005;
        n1.vy -= n1.y * 0.005;
        n1.vz -= n1.z * 0.005;
      }

      // Spring forces for links
      links.forEach((l) => {
        const n1 = nodes.find(n => n.id === l.source);
        const n2 = nodes.find(n => n.id === l.target);
        if (!n1 || !n2) return;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dz = n2.z - n1.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

        const displacement = dist - springLength;
        const force = displacement * kSpring;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        if (n1 !== dragNodeRef.current) {
          n1.vx += fx;
          n1.vy += fy;
          n1.vz += fz;
        }
        if (n2 !== dragNodeRef.current) {
          n2.vx -= fx;
          n2.vy -= fy;
          n2.vz -= fz;
        }
      });

      // Update positions
      nodes.forEach((n) => {
        if (n === dragNodeRef.current) {
          // Handle dragging directly projected from mouse
          n.vx = 0; n.vy = 0; n.vz = 0;
        } else {
          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;

          n.vx *= friction;
          n.vy *= friction;
          n.vz *= friction;
        }
      });

      // Orbit auto-rotation
      if (isRotating && !dragNodeRef.current) {
        angleY += 0.003;
      }

      // 2. Projection and Sorting
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Projection angles
      const rotX = tilt; // Tilt angle
      const rotY = pan + angleY; // Current pan + orbit rotation

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Project nodes to 2D
      const projectedNodes = nodes.map((n) => {
        // 3D rotation matrix
        // Y-axis rotation (Pan)
        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.x * sinY + n.z * cosY;

        // X-axis rotation (Tilt)
        let y2 = n.y * cosX - z1 * sinX;
        let z2 = n.y * sinX + z1 * cosX;

        // Perspective scaling
        const distCamera = 600;
        const scale = (distCamera / (distCamera + z2)) * zoom;

        return {
          node: n,
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          depth: z2, // larger is further away
          scale,
          visible: (filterType === 'all' || n.type === filterType)
        };
      });

      // Depth sort (painter algorithm - draw furthest first)
      projectedNodes.sort((a, b) => b.depth - a.depth);

      // 3. Draw Stage
      ctx.fillStyle = displayTheme === 'polaris' ? '#f8fafc' : '#0a0d14'; // Theme background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines (cybernetic feel)
      ctx.strokeStyle = displayTheme === 'polaris' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(20, 30, 50, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach((link) => {
        const p1 = projectedNodes.find(p => p.node.id === link.source);
        const p2 = projectedNodes.find(p => p.node.id === link.target);

        if (!p1 || !p2 || !p1.visible || !p2.visible) return;

        // Visual properties based on relationship type
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);

        // Highlight connected lines if selected
        const isHighlighted = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

        if (showClusters) {
          // Color code by community clusters
          if (p1.node.cluster === 1 && p2.node.cluster === 1) {
            ctx.strokeStyle = isHighlighted ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.35)';
          } else if (p1.node.cluster === 2 && p2.node.cluster === 2) {
            ctx.strokeStyle = isHighlighted ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.35)';
          } else {
            ctx.strokeStyle = isHighlighted ? 'rgba(16, 185, 129, 0.9)' : 'rgba(156, 163, 175, 0.15)';
          }
        } else {
          if (link.type === 'flagged_tx') {
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)'; // Yellow warning
            ctx.setLineDash([4, 4]);
          } else if (link.type === 'victim-offender') {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = isHighlighted ? 'rgba(147, 197, 253, 0.85)' : 'rgba(56, 189, 248, 0.18)';
            ctx.setLineDash([]);
          }
        }

        ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      });

      // Draw Nodes
      projectedNodes.forEach((pn) => {
        if (!pn.visible) return;

        const { node, px, py, scale } = pn;
        const size = node.val * scale;

        // Node Glow Effect
        const grad = ctx.createRadialGradient(px, py, size * 0.1, px, py, size * 1.5);
        let nodeColor = '#38bdf8'; // Default Sky blue
        let glowColor = 'rgba(56, 189, 248, 0.15)';

        if (showClusters) {
          if (node.cluster === 1) {
            nodeColor = '#ef4444'; // Red
            glowColor = 'rgba(239, 68, 68, 0.2)';
          } else if (node.cluster === 2) {
            nodeColor = '#3b82f6'; // Blue
            glowColor = 'rgba(59, 130, 246, 0.2)';
          } else if (node.cluster === 3) {
            nodeColor = '#10b981'; // Green
            glowColor = 'rgba(16, 185, 129, 0.2)';
          } else {
            nodeColor = '#eab308'; // Yellow
            glowColor = 'rgba(234, 179, 8, 0.2)';
          }
        } else {
          if (node.type === 'accused') {
            nodeColor = node.id.includes('SERIAL') ? '#f43f5e' : '#f87171';
            glowColor = 'rgba(244, 63, 94, 0.3)';
          } else if (node.type === 'victim') {
            nodeColor = '#60a5fa';
            glowColor = 'rgba(96, 165, 250, 0.15)';
          } else if (node.type === 'location') {
            nodeColor = '#34d399';
            glowColor = 'rgba(52, 211, 153, 0.2)';
          } else if (node.type === 'financial') {
            nodeColor = node.val > 9 ? '#facc15' : '#ca8a04';
            glowColor = 'rgba(250, 204, 21, 0.2)';
          }
        }

        // Apply highlights for selections
        const isSelected = selectedNode?.id === node.id || selectedEntityId === node.id;
        const isLinkedToSelected = selectedNode && links.some(l => 
          (l.source === selectedNode.id && l.target === node.id) ||
          (l.source === node.id && l.target === selectedNode.id)
        );

        if (isSelected) {
          // Extra big glowing border
          ctx.beginPath();
          ctx.arc(px, py, size * 2.2, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 12;
        } else if (isLinkedToSelected) {
          ctx.shadowColor = nodeColor;
          ctx.shadowBlur = 8;
        }

        // Draw radial glow sphere
        grad.addColorStop(0, nodeColor);
        grad.addColorStop(0.2, nodeColor);
        grad.addColorStop(0.5, glowColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(px, py, size * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();

        // Hard node core
        ctx.beginPath();
        ctx.arc(px, py, size * 0.55, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#ffffff' : nodeColor;
        ctx.fill();

        // Draw tactical radar ticks on special nodes
        if (node.id.includes('SERIAL') || isSelected) {
          ctx.beginPath();
          ctx.arc(px, py, size * 1.2, 0, 2 * Math.PI);
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Reset shadows
        ctx.shadowBlur = 0;

        // Label rendering (only render closer nodes or selected node labels to reduce clutter)
        if (pn.depth < 150 || isSelected || isLinkedToSelected || node.id.includes('SERIAL')) {
          ctx.fillStyle = isSelected 
            ? (displayTheme === 'polaris' ? '#0f172a' : '#ffffff') 
            : (displayTheme === 'polaris' ? '#475569' : 'rgba(226, 232, 240, 0.95)');
          ctx.font = isSelected ? 'bold 11px JetBrains Mono, sans-serif' : '9px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, px, py - size * 1.4);

          // Add minor metadata text for special ones
          if (node.id.includes('SERIAL')) {
            ctx.fillStyle = '#ef4444';
            ctx.font = '7px JetBrains Mono';
            ctx.fillText('WARNING: MULTI-OFFENSE', px, py + size * 1.6);
          }
        }
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes, links, filterType, isRotating, showClusters, zoom, tilt, pan, selectedNode, selectedEntityId]);

  // Handle canvas click / drag setup
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Projection reverse detection to find which 2D projected coordinate matches mouse
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rotX = tilt;
    const rotY = pan; // omit rotation for simpler math approximation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    let clickedPN: any = null;
    let minDist = 25; // Click radius

    // Recalculate projecting points for finding clicked node
    nodes.forEach((n) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let x1 = n.x * cosY - n.z * sinY;
      let z1 = n.x * sinY + n.z * cosY;
      let y2 = n.y * cosX - z1 * sinX;
      let z2 = n.y * sinX + z1 * cosX;

      const scale = (600 / (600 + z2)) * zoom;
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      const dist = Math.sqrt((mouseX - px) ** 2 + (mouseY - py) ** 2);
      if (dist < minDist) {
        minDist = dist;
        clickedPN = n;
      }
    });

    if (clickedPN) {
      dragNodeRef.current = clickedPN;
      setSelectedNode(clickedPN);
      mousePosRef.current = { x: mouseX, y: mouseY };
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragNodeRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - mousePosRef.current.x;
    const dy = mouseY - mousePosRef.current.y;

    // Drag node movement in 3D (simple projection approximation)
    dragNodeRef.current.x += dx * (1 / zoom);
    dragNodeRef.current.y += dy * (1 / zoom);

    mousePosRef.current = { x: mouseX, y: mouseY };
  };

  const handleMouseUp = () => {
    dragNodeRef.current = null;
  };

  const isPolaris = displayTheme === 'polaris';
  const bgCard = isPolaris ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/90 border-slate-800 text-slate-200';
  const bgSubCard = isPolaris ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300';
  const textTitle = isPolaris ? 'text-slate-900 font-bold' : 'text-slate-100 font-bold';
  const textMuted = isPolaris ? 'text-slate-500' : 'text-slate-400';
  const borderTheme = isPolaris ? 'border-slate-200' : 'border-slate-800';

  // Filter cases based on search term
  const filteredFirs = firs.filter(f => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      f.id.toLowerCase().includes(term) ||
      f.crime_type.toLowerCase().includes(term) ||
      f.station.toLowerCase().includes(term) ||
      f.district.toLowerCase().includes(term) ||
      f.mo_description.toLowerCase().includes(term) ||
      f.narrative_text.toLowerCase().includes(term) ||
      f.ipc_sections.some(sec => sec.toLowerCase().includes(term))
    );
  });

  const handleSelectCaseFromList = (fir: FIR) => {
    // Find matching node in simulation to highlight
    const matchingNode = nodes.find(n => n.id === fir.id || n.label.toLowerCase().includes(fir.id.toLowerCase()));
    if (matchingNode) {
      setSelectedNode(matchingNode);
    } else {
      // Create a temporary mock node so local card displays details
      setSelectedNode({
        id: fir.id,
        label: fir.id,
        type: 'accused',
        val: 14,
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0,
        cluster: 0,
        originalData: fir
      });
    }
    // Also trigger parent callback for inspection summary modal
    onSelectEntity(fir.id, 'fir');
  };

  return (
    <div id="network_graph_root" className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[600px] relative">
      {/* Sidebar Control Panel */}
      <div id="network_controls" className={`lg:col-span-1 p-4 rounded-xl flex flex-col justify-between gap-4 h-full shadow-2xl backdrop-blur-md border ${bgCard}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="font-semibold text-xs tracking-widest text-sky-400 font-mono uppercase">Link-Analysis Dashboard</span>
          </div>
          
          <p className="text-[10.5px] leading-relaxed">
            Multi-dimensional relationship network. Drag nodes to explore. Click any case in the ledger below to center and briefing details.
          </p>

          {/* Search Bar for Cases details */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-mono">Search Cases & Details</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search case #, station, IPC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 border ${
                  isPolaris 
                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Near Orbit Case Ledger List Pattern */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-mono">Near Orbit Case Ledger</span>
              <span className="text-[9px] font-mono text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded">
                {filteredFirs.length} cases
              </span>
            </div>
            <div className={`overflow-y-auto max-h-[180px] space-y-1.5 pr-1 border rounded-lg p-2 ${bgSubCard}`}>
              {filteredFirs.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic text-center py-4">No matching cases</p>
              ) : (
                filteredFirs.slice(0, 30).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleSelectCaseFromList(f)}
                    className={`p-2 rounded border cursor-pointer text-left transition-all hover:translate-x-0.5 ${
                      selectedNode?.id === f.id
                        ? 'bg-sky-500/15 border-sky-400/50'
                        : isPolaris 
                          ? 'bg-white border-slate-200 hover:border-slate-300' 
                          : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="text-sky-400">{f.id}</span>
                      <span className="text-slate-500 text-[9px]">{f.date}</span>
                    </div>
                    <p className="text-[10.5px] font-semibold font-sans mt-0.5 truncate">{f.crime_type}</p>
                    <p className="text-[9px] font-mono text-slate-500 truncate">{f.station} // {f.ipc_sections[0]}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Node Category Filters */}
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 font-mono">Entity Filters</span>
            <div className="grid grid-cols-2 gap-1 mt-0.5">
              <button
                onClick={() => setFilterType('all')}
                className={`py-1 px-2 text-[9px] rounded font-mono text-left transition-all border ${
                  filterType === 'all' 
                    ? 'bg-sky-500/10 border-sky-400 text-sky-400 font-bold' 
                    : isPolaris 
                      ? 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200' 
                      : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                ● All Nodes
              </button>
              <button
                onClick={() => setFilterType('accused')}
                className={`py-1 px-2 text-[9px] rounded font-mono text-left transition-all border ${
                  filterType === 'accused' 
                    ? 'bg-rose-500/10 border-rose-400 text-rose-400 font-bold' 
                    : isPolaris 
                      ? 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200' 
                      : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                ● Accused
              </button>
              <button
                onClick={() => setFilterType('victim')}
                className={`py-1 px-2 text-[9px] rounded font-mono text-left transition-all border ${
                  filterType === 'victim' 
                    ? 'bg-blue-500/10 border-blue-400 text-blue-400 font-bold' 
                    : isPolaris 
                      ? 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200' 
                      : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                ● Victims
              </button>
              <button
                onClick={() => setFilterType('location')}
                className={`py-1 px-2 text-[9px] rounded font-mono text-left transition-all border ${
                  filterType === 'location' 
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 font-bold' 
                    : isPolaris 
                      ? 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200' 
                      : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                ● Hotspots
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Cluster Detection */}
        <div className="space-y-2 mt-2">
          <button
            onClick={() => setShowClusters(!showClusters)}
            className={`w-full py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              showClusters 
                ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${showClusters ? 'animate-spin' : ''}`} />
            {showClusters ? 'Dissolve Clusters' : 'Detect Clusters'}
          </button>

          {/* Quick Stats */}
          <div className={`p-2 rounded-lg border flex items-center justify-between text-[9px] font-mono ${bgSubCard}`}>
            <span className="text-slate-500">Nodes:</span>
            <span className="text-sky-400 font-bold">{nodes.length}</span>
            <span className="text-slate-500 ml-1">Links:</span>
            <span className="text-sky-400 font-bold">{links.length}</span>
          </div>
        </div>
      </div>

      {/* Main interactive Canvas block */}
      <div id="network_graph_canvas_wrapper" ref={containerRef} className={`lg:col-span-3 rounded-xl border relative overflow-hidden flex flex-col justify-end shadow-inner h-[600px] ${
        isPolaris ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        {/* Graph Heading Floating Tag */}
        <div className={`absolute top-3 left-3 border px-3 py-1.5 rounded-md backdrop-blur flex items-center gap-2 z-10 select-none ${
          isPolaris ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <Disc className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">3D Orbit Linkages Map</span>
        </div>

        {/* Legend */}
        <div className={`absolute top-3 right-3 border p-2.5 rounded-md backdrop-blur z-10 text-[9px] font-mono space-y-1 select-none ${
          isPolaris ? 'bg-white/95 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
            <span>Accused / Suspects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#60a5fa]" />
            <span>Victims / Complainants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>Hotspots / Crime Scenes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#facc15]" />
            <span>Mule Bank Accounts</span>
          </div>
        </div>

        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Floating details panel for selected Node */}
        {selectedNode && (
          <div className={`absolute bottom-4 right-4 border p-4 rounded-xl max-w-sm backdrop-blur-md shadow-2xl z-20 space-y-2.5 font-mono text-xs ${
            isPolaris ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-slate-800/10">
              <span className="font-bold text-sky-500 uppercase text-[10px]">{selectedNode.type} ID: {selectedNode.id}</span>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-slate-300 text-lg font-bold">×</button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div><strong className="text-slate-500">Name/Label:</strong> <span className="font-sans font-bold">{selectedNode.label}</span></div>
              
              {/* Detailed Accused Data */}
              {selectedNode.type === 'accused' && selectedNode.originalData && (
                <>
                  <div><strong className="text-slate-500">Age/Gender:</strong> {selectedNode.originalData.age} yrs, {selectedNode.originalData.gender}</div>
                  <div><strong className="text-slate-500">District:</strong> {selectedNode.originalData.district}</div>
                  <div><strong className="text-slate-500">Priors:</strong> <span className="text-rose-400">{selectedNode.originalData.prior_offenses?.join(', ') || 'None'}</span></div>
                  <div><strong className="text-slate-500">Address:</strong> {selectedNode.originalData.address}</div>
                  {selectedNode.id.includes('SERIAL') && (
                    <div className="text-rose-500 font-bold mt-1.5 bg-rose-500/10 p-2 rounded border border-rose-500/20 text-[10px]">
                      ⚠️ MULTI-OFFENSE CLINICAL SUSPECT SIGNATURE DETECTED
                    </div>
                  )}
                </>
              )}

              {/* Detailed Location Data */}
              {selectedNode.type === 'location' && selectedNode.originalData && (
                <>
                  <div><strong className="text-slate-500">Type:</strong> {selectedNode.originalData.type}</div>
                  <div><strong className="text-slate-500">Jurisdiction:</strong> {selectedNode.originalData.station_jurisdiction}</div>
                  <div><strong className="text-slate-500">Coordinates:</strong> {selectedNode.originalData.lat?.toFixed(4)}, {selectedNode.originalData.lng?.toFixed(4)}</div>
                </>
              )}

              {/* Detailed Financial Data */}
              {selectedNode.type === 'financial' && selectedNode.originalData && (
                <>
                  <div><strong className="text-slate-500">Linked Case No:</strong> <span className="text-sky-400 font-bold">{selectedNode.originalData.linked_fir_id}</span></div>
                  <div><strong className="text-slate-500">Account Flow:</strong> {selectedNode.originalData.from_account} ➔ {selectedNode.originalData.to_account}</div>
                  <div><strong className="text-slate-500">Amount:</strong> <span className="text-emerald-400 font-bold">₹{selectedNode.originalData.amount?.toLocaleString()}</span></div>
                  {selectedNode.originalData.flagged && (
                    <div className="text-amber-500 font-bold bg-amber-500/10 p-2 rounded border border-amber-500/20 text-[10px] mt-1">
                      ⚠️ FLAG-RED: EMBEZZLEMENT / SCAM ACCOUNT SIGNATURE
                    </div>
                  )}
                </>
              )}

              {/* Case details when direct case clicked */}
              {selectedNode.originalData && selectedNode.originalData.mo_description && (
                <div className={`p-2 rounded border text-[10px] mt-2 ${bgSubCard}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sky-400">CASE NUMBER: {selectedNode.originalData.id}</span>
                    <span className="font-sans text-rose-400">{selectedNode.originalData.ipc_sections?.join(', ')}</span>
                  </div>
                  <p className="font-sans line-clamp-3 text-slate-400">{selectedNode.originalData.mo_description}</p>
                </div>
              )}
            </div>
            
            <div className="pt-2 flex justify-between gap-2">
              <button
                onClick={() => {
                  if (selectedNode.type === 'accused' || selectedNode.type === 'victim') {
                    onSelectEntity(selectedNode.id, 'person');
                  } else if (selectedNode.type === 'financial') {
                    onSelectEntity(selectedNode.originalData.linked_fir_id, 'fir');
                  } else if (selectedNode.originalData && selectedNode.originalData.mo_description) {
                    onSelectEntity(selectedNode.originalData.id, 'fir');
                  } else {
                    onSelectEntity(selectedNode.id, 'fir');
                  }
                }}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-1.5 px-3 rounded text-[10px] uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                View Case Briefing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
