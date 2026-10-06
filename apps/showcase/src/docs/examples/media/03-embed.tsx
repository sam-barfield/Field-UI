// title: Map and video embeds
// description: AspectRatio keeps iframes, videos and maps at a fixed shape at every width. Always give iframes a title.
import { AspectRatio, Grid } from '@sam.barfield/field-react';

export default function EmbedExample() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap="$4" className="example-wide">
      <AspectRatio ratio={4 / 3} radius="lg">
        <iframe
          title="Map showing our location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-2.6,51.448,-2.58,51.458&layer=mapnik"
          loading="lazy"
        />
      </AspectRatio>
      <AspectRatio ratio={4 / 3} radius="lg">
        <video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls muted playsInline aria-label="Sample video" />
      </AspectRatio>
    </Grid>
  );
}
