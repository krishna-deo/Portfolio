import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { vertexShader, fragmentShader } from './HeroShaders';

import imgSpiderman from '../assets/spiderman/1765182374858-Photoroom.png';

export default function Hero() {

  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {

    if (!containerRef.current) return;

    const container = containerRef.current;

    // Entrance animation
    gsap.fromTo(
      container,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power3.out",
        delay: 0.1
      }
    );

    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: -60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.8
        }
      );
    }

    // THREE scene
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -1,1,1,-1,0,1
    );

    const renderer = new THREE.WebGLRenderer({
      alpha:true,
      antialias:true
    });

    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width,height);

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio,2)
    );

    container.appendChild(
      renderer.domElement
    );

    // Uniforms
    const uniforms = {

      uTexture1:{
        value:null
      },

      uResolution:{
        value:new THREE.Vector2(
          width,
          height
        )
      },

      uImageResolution:{
        value:new THREE.Vector2(
          1920,
          1080
        )
      }

    };

    // Load image
    const textureLoader =
      new THREE.TextureLoader();

    let isLoaded=false;

    textureLoader
    .loadAsync(imgSpiderman)
    .then((tex)=>{

      tex.generateMipmaps=false;

      tex.minFilter=
      THREE.LinearFilter;

      tex.magFilter=
      THREE.LinearFilter;

      uniforms.uTexture1.value=tex;

      if(tex.image){
        uniforms
        .uImageResolution
        .value
        .set(
          tex.image.width,
          tex.image.height
        );
      }

      isLoaded=true;

    });

    // Shader material
    const geometry =
      new THREE.PlaneGeometry(2,2);

    const material =
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    scene.add(mesh);

    // Render loop
    const renderTick=()=>{

      if(!isLoaded) return;

      renderer.render(
        scene,
        camera
      );

    };

    gsap.ticker.add(renderTick);

    // Resize
    const onResize=()=>{

      const w=
        container.clientWidth;

      const h=
        container.clientHeight;

      renderer.setSize(w,h);

      uniforms
      .uResolution
      .value
      .set(w,h);

    };

    window.addEventListener(
      'resize',
      onResize
    );

    // Cleanup
    return()=>{

      gsap.ticker.remove(
        renderTick
      );

      window.removeEventListener(
        'resize',
        onResize
      );

      container.removeChild(
        renderer.domElement
      );

      renderer.dispose();

      material.dispose();

      geometry.dispose();

    };

  },[]);



  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">

      {/* Three Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
      />

      {/* Text */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center mx-auto w-full max-w-[90rem] px-8 lg:px-16 mt-20"
      >

        <div className="w-full flex flex-col md:flex-row justify-between md:items-end gap-10">

          <div className="flex-1 max-w-lg">

            <p className="text-sm md:text-base text-gray-300 tracking-widest uppercase mb-6">
              Hey, I’m Krishna
            </p>

            <h1 className="text-base md:text-xl lg:text-2xl xl:text-[2.7rem] font-bold leading-[1.05]">

              Building Secure &

              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white italic font-light">
                Scalable Digital Systems
              </span>

              <br />

              from

              <br />

              End to End

            </h1>

          </div>


          <div className="flex-1 max-w-md md:text-right flex flex-col md:items-end">

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              I build high-performance web applications focused on security, scalable backend architecture, and seamless user experience.
            </p>

            <button className="pointer-events-auto px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all">
              Start a Project
            </button>

          </div>

        </div>

      </div>

      {/* cinematic overlays */}

      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-10" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />

    </div>
  );
}