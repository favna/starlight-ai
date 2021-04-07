import { MessageEmbed, ColorResolvable, MessageEmbedOptions } from 'discord.js';

const EMBED_TYPES = ['embed', 'title', 'field', 'timestamp', 'footer', 'description', 'url'] as const;

export type EmbedInformation = TitleInformation | FieldInformation | TimestampInformation | FooterInformation | DescriptionInformation | UrlInformation;

type TitleInformation = [null, string];
type DescriptionInformation = [null, string];
type UrlInformation = [null, string];
type FieldInformation = [{ title?: string; inline?: boolean }, string];
type TimestampInformation = [null, number | string | Date | null];
type FooterInformation = [null | { iconURL?: string; proxyIconURL?: string }, string];
type EmbedInitialInformation = [{ color: ColorResolvable }, ...EmbedInformation[]];

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StarEmbed {
	export function make(type: typeof EMBED_TYPES[number], ...data: EmbedInformation | EmbedInitialInformation): MessageEmbedOptions | MessageEmbed {
		// console.log(type, data);
		if (!EMBED_TYPES.includes(type)) throw new TypeError(`Invalid type passed, expected one of ${EMBED_TYPES.join(', ')}, got: ${type}`);
		switch (type) {
			case 'embed': {
				const info = data as EmbedInitialInformation;
				let embedInfo: MessageEmbedOptions = {};
				for (const value of info) {
					if ('fields' in value) {
						if (!Array.isArray(embedInfo)) {
							embedInfo.fields = [];
						}
						embedInfo.fields!.push(...(value as MessageEmbedOptions).fields!);
						continue;
					}
					embedInfo = { ...value, ...embedInfo };
				}
				// console.log(embedInfo);
				return new MessageEmbed(embedInfo);
			}
			case 'title': {
				const info = data as TitleInformation;
				return { title: info[1] };
			}
			case 'field': {
				const info = data as FieldInformation;
				return { fields: [{ name: info[0].title ?? '', inline: info[0].inline ?? false, value: info[1] }] };
			}
			case 'footer': {
				const info = data as FooterInformation;
				return {
					footer: info[0] === null ? { text: info[1] } : { proxyIconURL: info[0].proxyIconURL, iconURL: info[0].iconURL, text: info[1] }
				};
			}
			case 'timestamp': {
				const info = data as TimestampInformation;
				return { timestamp: info[1] === null ? Date.now() : new Date(info[1]) };
			}
			case 'description': {
				const info = data as DescriptionInformation;
				return { description: info[1] };
			}
			case 'url': {
				const info = data as UrlInformation;
				return { url: info[1] };
			}
		}
	}
}
