import { LocalStorage, showToast, Toast } from '@raycast/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Model, ModelHook } from '../type';

export const PromptCollection = {
	improve: 'Your task is to rephrase the given statement in written with clear logic and high information density.',
	summary:
		'Your task is to summary the given statement  with clear logic and high information density, in at most 50 words.',
};

export const DEFAULT_MODEL: Model = {
	id: 'default',
	updated_at: new Date().toISOString(),
	created_at: new Date().toISOString(),
	name: 'Default',
	prompt: PromptCollection.improve,
	option: 'gpt-3.5-turbo',
	temperature: 1,
	pinned: false,
};

export const SUMMARY_MODEL: Model = {
	...DEFAULT_MODEL,
	prompt: PromptCollection.summary,
};

export function useModel(): ModelHook {
	const [data, setData] = useState<Model[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);

	const option: Model['option'][] = ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];

	useEffect(() => {
		(async () => {
			setLoading(true);
			const storedModels = await LocalStorage.getItem<string>('models');

			if (!storedModels) {
				setData([DEFAULT_MODEL]);
			} else {
				setData((previous) => [...previous, ...JSON.parse(storedModels)]);
			}
			setLoading(false);
		})();
	}, []);

	useEffect(() => {
		LocalStorage.setItem('models', JSON.stringify(data));
	}, [data]);

	const add = useCallback(
		async (model: Model) => {
			const toast = await showToast({
				title: 'Saving your model...',
				style: Toast.Style.Animated,
			});
			const newModel: Model = { ...model, created_at: new Date().toISOString() };
			setData([...data, newModel]);
			toast.title = 'Model saved!';
			toast.style = Toast.Style.Success;
		},
		[setData, data]
	);

	const update = useCallback(
		async (model: Model) => {
			setData((prev) => {
				return prev.map((x) => {
					if (x.id === model.id) {
						return model;
					}
					return x;
				});
			});
		},
		[setData, data]
	);

	const remove = useCallback(
		async (model: Model) => {
			const toast = await showToast({
				title: 'Remove your model...',
				style: Toast.Style.Animated,
			});
			const newModels: Model[] = data.filter((oldModel) => oldModel.id !== model.id);
			setData(newModels);
			toast.title = 'Model removed!';
			toast.style = Toast.Style.Success;
		},
		[setData, data]
	);

	const clear = useCallback(async () => {
		const toast = await showToast({
			title: 'Clearing your models ...',
			style: Toast.Style.Animated,
		});
		const newModels: Model[] = data.filter((oldModel) => oldModel.id === DEFAULT_MODEL.id);
		setData(newModels);
		toast.title = 'Models cleared!';
		toast.style = Toast.Style.Success;
	}, [setData]);

	return useMemo(
		() => ({ data, isLoading, option, add, update, remove, clear }),
		[data, isLoading, option, add, update, remove, clear]
	);
}
