<!--
	Marco rojo "estilo menú del inicio" detrás de una tarjeta: bloque inclinado que crece desde la izquierda con
	sombra dura. Se muestra con hover, foco de teclado, [data-selected] (lo pone KeyNav) o cuando algún control
	interior está seleccionado. La tarjeta que lo contiene debe tener las clases `nav-card relative isolate`.
-->
<span aria-hidden="true" class="paper"></span>
<span aria-hidden="true" class="frame"></span>

<style>
	.paper {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background: var(--color-surface);
	}
	.frame {
		position: absolute;
		inset: -0.75rem -1rem;
		z-index: -2;
		pointer-events: none;
		background: var(--color-primary);
		box-shadow: 6px 6px 0 var(--color-secondary);
		transform-origin: left;
		transform: skewX(calc(var(--skew) / 2)) scaleX(0);
		transition: transform 0.22s var(--ease-snap);
	}
	@media (min-width: 48rem) {
		.frame {
			box-shadow: 8px 8px 0 var(--color-secondary);
		}
	}
	:global(.nav-card:is(:hover, [data-selected], :focus-visible, :has([data-selected], :focus-visible))) .frame {
		transform: skewX(calc(var(--skew) / 2)) scaleX(1);
	}
	/* La sombra propia de la tarjeta se sustituye por la del marco */
	:global(.nav-card:is(:hover, [data-selected], :focus-visible, :has([data-selected], :focus-visible))) {
		box-shadow: none;
	}
</style>
