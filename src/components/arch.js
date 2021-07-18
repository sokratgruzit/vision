var materialShader;
      var waveGeo = new THREE.CircleGeometry( 10, 32 );
      var waveMat = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(
          require("../assets/space.jpg")
        ),
        depthWrite: false, 
        transparent: true, 
        //opacity: 0.5, 
        side:THREE.DoubleSide, 
        combine: THREE.MixOperation 
      });
      waveMat.onBeforeCompile = shader => {
        shader.uniforms.impactPosition = {
          value: new THREE.Vector3().setFromSphericalCoords(
            point.x,
            point.y,
            point.z
          )
        };
        shader.uniforms.impactMaxRadius = { value: waveGeo.parameters.radius * 3 };
        shader.uniforms.impactRatio = { value: 0.25 };
        shader.vertexShader = "varying vec3 vPosition;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <worldpos_vertex>",
          `#include <worldpos_vertex>
          vPosition = transformed.xyz;`
        );
        shader.fragmentShader =
          `uniform vec3 impactPosition;\nuniform float impactMaxRadius;\nuniform float impactRatio;\nvarying vec3 vPosition;\n` +
          shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
            float dist = distance(vPosition, impactPosition);
            float curRadius = impactMaxRadius * impactRatio;
            float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.99 * impactRatio ), curRadius, dist);
            sstep = 1. - sstep * (1. - impactRatio);
            vec3 col = mix(vec3(1., 0.5, 0.0625), vec3(1., 0.25, 0.125), impactRatio);
            gl_FragColor = vec4( mix( col, gl_FragColor.rgb, sstep), diffuseColor.a );`
        );
        materialShader = shader;
      };

      var globe = new THREE.Mesh(waveGeo, waveMat);
      this.scene.add(globe);

      function runTween() {
        var tween = new TWEEN.Tween({value: 0})
          .to({ value: 1 }, 3000)
          //.easing(TWEEN.Easing.Quintic.Out)
          .onUpdate(val => {
            if (materialShader) materialShader.uniforms.impactRatio.value = val.value;
          })
          .onComplete((val) => {
            if (materialShader) materialShader.uniforms.impactPosition.value.setFromSphericalCoords(
              point.x,
              point.y,
              point.z
            );
            runTween();
          });
        tween.start();
      }

      runTween();