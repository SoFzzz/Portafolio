<!--
	Fondo y sombra de una tarjeta. La sombra es un bloque oscuro con exactamente la forma de la tarjeta (como el
	marco de la foto en "Sobre mí"): en reposo asoma 6/8 px y, al seleccionarla, se desliza en diagonal mientras la
	tarjeta se eleva un poco. Solo depende de [data-selected] (lo pone KeyNav, también para el puntero), así que
	nunca hay dos tarjetas resaltadas. La tarjeta que lo contiene debe tener las clases `nav-card relative isolate`.
-->
<span aria-hidden="true" class="paper"></span>
<span aria-hidden="true" class="shade"></span>

<style>
	.paper {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background: var(--color-surface);
	}
	.shade {
		position: absolute;
		inset: 0;
		z-index: -2;
		pointer-events: none;
		background: var(--color-secondary);
		transform: translate(6px, 6px);
		transition: transform 0.22s var(--ease-snap);
	}
	:global(.nav-card) {
		transition: transform 0.2s ease-out;
	}
	@media (min-width: 48rem) {
		.shade {
			transform: translate(8px, 8px);
		}
	}
	/* Seleccionada (o con un control interior seleccionado): la tarjeta sube 3 px y la sombra sale hasta ~16/20 px */
	:global(.nav-card:is([data-selected], :has([data-selected]))) {
		transform: translate(-3px, -3px) scale(1.03);
		z-index: 1;
	}
	:global(.nav-card:is([data-selected], :has([data-selected]))) .shade {
		transform: translate(19px, 19px);
	}
	@media (min-width: 48rem) {
		:global(.nav-card:is([data-selected], :has([data-selected]))) .shade {
			transform: translate(23px, 23px);
		}
	}
</style>
