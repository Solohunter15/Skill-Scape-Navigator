import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useCareer } from "../../context/CareerContext";
import { SkillCategory, SkillNode } from "../../types/career";
import { SkillNodeHUD } from "./SkillNodeHUD";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Search,
  Maximize2,
  Minimize2,
  Eye,
  Sparkles,
  Layers,
} from "lucide-react";

const CATEGORIES: ("All" | SkillCategory)[] = [
  "All",
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "AI & Data",
  "System Architecture",
  "Leadership",
];

export function SkillGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { skills, selectedSkill, setSelectedSkill, addXp } = useCareer();

  const [activeCategory, setActiveCategory] = useState<"All" | SkillCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);

  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const starFieldRef = useRef<THREE.Points | null>(null);

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [skills, activeCategory, searchQuery]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.005);
    sceneRef.current = scene;

    // --- 2. Camera setup ---
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 30, 110);
    cameraRef.current = camera;

    // --- 3. Renderer setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070b14, 1);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 4. Controls setup ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 25;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controlsRef.current = controls;

    // --- 5. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.0, 300);
    pointLight2.position.set(50, 40, -50);
    scene.add(pointLight2);

    // --- 6. Particle Starfield ---
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const baseColors = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0x34d399),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 90 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = baseColors[Math.floor(Math.random() * baseColors.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    starFieldRef.current = starField;

    // --- 7. Raycasting for Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const skillId = hitMesh.userData.skillId;
        const skill = skills.find((s) => s.id === skillId);
        if (skill) {
          setHoveredSkill(skill);
          renderer.domElement.style.cursor = "pointer";
        }
      } else {
        setHoveredSkill(null);
        renderer.domElement.style.cursor = "default";
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const skillId = hitMesh.userData.skillId;
        const skill = skills.find((s) => s.id === skillId);
        if (skill) {
          setSelectedSkill(skill);
          controls.autoRotate = false;
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("click", onPointerDown);

    // --- 8. Resize Handler ---
    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", onResize);

    // --- 9. Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (starFieldRef.current) {
        starFieldRef.current.rotation.y += 0.0003;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("mousemove", onPointerMove);
        renderer.domElement.removeEventListener("click", onPointerDown);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  // Update nodes and constellation lines whenever skills or filteredSkills change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous node meshes and lines
    nodeMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    nodeMeshesRef.current.clear();

    // Remove existing lines
    const oldLines = scene.children.filter((c) => c.userData.isConstellationLine);
    oldLines.forEach((l) => scene.remove(l));

    const skillMap = new Map<string, SkillNode>();
    skills.forEach((s) => skillMap.set(s.id, s));

    // --- Create Skill Nodes ---
    skills.forEach((skill) => {
      const isVisible = filteredSkills.some((fs) => fs.id === skill.id);
      const isSelected = selectedSkill?.id === skill.id;

      // Base radius scaled by level (1.5 - 3.5)
      const radius = 1.6 + (skill.level / 100) * 1.8;
      const geometry = new THREE.SphereGeometry(radius, 24, 24);

      const colorHex = new THREE.Color(skill.color);

      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 0.9 : isVisible ? 0.45 : 0.1,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: isVisible ? 0.95 : 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const [x, y, z] = skill.position3D;
      mesh.position.set(x, y, z);
      mesh.userData = { skillId: skill.id };

      // Outer Halo wireframe for mastered or selected nodes
      if (skill.level >= 80 || isSelected) {
        const haloGeo = new THREE.SphereGeometry(radius * 1.4, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          wireframe: true,
          transparent: true,
          opacity: isSelected ? 0.6 : 0.25,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        mesh.add(halo);
      }

      scene.add(mesh);
      nodeMeshesRef.current.set(skill.id, mesh);
    });

    // --- Create Constellation Link Lines ---
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    skills.forEach((skill) => {
      if (skill.prerequisites.length > 0) {
        const [x1, y1, z1] = skill.position3D;
        const color1 = new THREE.Color(skill.color);

        skill.prerequisites.forEach((preId) => {
          const preSkill = skillMap.get(preId);
          if (preSkill) {
            const [x2, y2, z2] = preSkill.position3D;
            const color2 = new THREE.Color(preSkill.color);

            linePositions.push(x1, y1, z1, x2, y2, z2);
            lineColors.push(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
          }
        });
      }
    });

    if (linePositions.length > 0) {
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        linewidth: 1,
      });

      const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      lineSegments.userData = { isConstellationLine: true };
      scene.add(lineSegments);
    }
  }, [skills, filteredSkills, selectedSkill]);

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 30, 110);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.autoRotate = true;
  };

  const toggleAutoRotate = () => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[540px] md:h-[620px]"
      }`}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay HUD: Controls & Filters */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Category Filters */}
        <div className="flex flex-wrap gap-1.5 pointer-events-auto bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 h-8 w-36 md:w-48 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 placeholder-slate-500 backdrop-blur-md focus:outline-none focus:border-cyan-500/50 focus:w-56 transition-all"
            />
          </div>

          {/* Reset Camera */}
          <Button
            size="sm"
            variant="outline"
            onClick={resetCamera}
            className="h-8 w-8 p-0 border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0 border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Galaxy"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Hovered Skill Floating Label */}
      {hoveredSkill && !selectedSkill && (
        <div className="absolute bottom-16 left-6 z-10 pointer-events-none bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-lg backdrop-blur-md shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hoveredSkill.color }}
            />
            <span className="font-bold text-xs text-white">{hoveredSkill.name}</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-slate-700 text-slate-300">
              Lvl {hoveredSkill.level}
            </Badge>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Click node to view prerequisites, XP progress, and quests.
          </div>
        </div>
      )}

      {/* Selected Skill HUD modal/popover */}
      {selectedSkill && (
        <SkillNodeHUD
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onBoostXp={addXp}
        />
      )}

      {/* Bottom Instructions & Constellation Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Frontend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Backend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Cloud/DevOps
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> AI/Data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Architecture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Leadership
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span>Click: Inspect</span>
          <span>•</span>
          <span>Drag: Orbit 360°</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
        </div>
      </div>
    </div>
  );
}

